const { Op } = require("sequelize");
const {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ApolloError,
} = require("apollo-server-express");
const { User, EscapeRoom, Booking, Review } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    getAllEscapeRooms: async () => {
      const rooms = await EscapeRoom.findAll({
        include: [
          {
            model: Review,
            include: [User],
          },
        ],
      });

      return rooms.map((room) => {
        const reviews = room.reviews || [];
        return {
          ...room.get({ plain: true }),
          reviews: reviews.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          ),
        };
      });
    },

    getEscapeRoom: async (parent, { id }) => {
      const room = await EscapeRoom.findByPk(id, {
        include: [
          {
            model: Review,
            include: [User],
          },
        ],
      });

      if (!room) return null;

      const reviews = room.reviews || [];
      return {
        ...room.get({ plain: true }),
        reviews: reviews.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ),
      };
    },

    availableSlots: async (
      parent,
      { escape_room_id, start_date, end_date }
    ) => {
      const escapeRoom = await EscapeRoom.findByPk(escape_room_id);
      if (!escapeRoom) {
        throw new UserInputError("Escape room not found");
      }

      const duration = escapeRoom.duration;
      const slots = [];
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const currentDate = new Date(startDate);
      const now = new Date();

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0];
        let currentTime = new Date(`${dateStr}T10:00:00`);

        const endTime = new Date(`${dateStr}T22:00:00`);

        while (currentTime < endTime) {
          const slotEndTime = new Date(
            currentTime.getTime() + duration * 60000
          );

          if (slotEndTime > endTime) break;

          const time = currentTime.toTimeString().split(" ")[0];
          const slotDateTime = new Date(`${dateStr}T${time}`);

          if (slotDateTime > now) {
            const existingBooking = await Booking.findOne({
              where: {
                escape_room_id,
                date: dateStr,
                time: time,
              },
            });

            if (!existingBooking) {
              slots.push({
                date: dateStr,
                time: time,
              });
            }
          }

          currentTime = slotEndTime;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return slots;
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findByPk(context.user.id);
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    getAllUserBookings: async (parent, args, context) => {
      if (context.user) {
        return await Booking.findAll({
          where: {
            user_id: context.user.id,
          },
          include: [
            {
              model: EscapeRoom,
              attributes: [
                "theme",
                "genre",
                "difficulty",
                "ageGroup",
                "playersMin",
                "playersMax",
                "price",
                "duration",
                "description",
                "image_url",
              ],
            },
          ],
          order: [["created_at", "DESC"]],
        });
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    getSingleBooking: async (parent, { booking_id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const booking = await Booking.findByPk(booking_id, {
        include: [
          {
            model: EscapeRoom,
            attributes: ["theme", "price"],
          },
        ],
      });

      if (!booking) {
        throw new UserInputError("Booking not found");
      }

      if (booking.user_id !== context.user.id) {
        throw new ForbiddenError(
          "You don't have permission to view this booking!"
        );
      }

      return booking;
    },
  },

  Mutation: {
    updateBookingPayment: async (
      parent,
      { booking_id, payment_status, payment_amount, payment_method },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const booking = await Booking.findByPk(booking_id);
      if (!booking) {
        throw new UserInputError("Booking not found");
      }

      if (booking.user_id !== context.user.id) {
        throw new ForbiddenError(
          "You don't have permission to update this booking!"
        );
      }

      try {
        booking.payment_status = payment_status;
        booking.payment_amount = payment_amount;
        booking.payment_method = payment_method;
        await booking.save();

        return booking;
      } catch (error) {
        console.error("Error updating booking payment:", error);
        throw new ApolloError("Failed to update payment. Please try again.");
      }
    },

    createUser: async (parent, { firstName, lastName, email, password }) => {
      try {
        const existingUser = await User.findOne({
          where: {
            email,
          },
        });

        if (existingUser) {
          throw new UserInputError("Email is already in use.");
        }
        const user = await User.create({
          firstName,
          lastName,
          email,
          password,
        });
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.error("Error creating user:", err);
        throw new ApolloError("Failed to create user. Please try again.");
      }
    },

    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          throw new AuthenticationError("Incorrect email or password!");
        }

        const correctPw = await user.checkPassword(password);
        if (!correctPw) {
          throw new AuthenticationError("Incorrect email or password!");
        }
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.error("Login error:", err);
        throw err;
      }
    },

    updateEmail: async (parent, { email }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const existingUser = await User.findOne({
          where: { email: email.toLowerCase() },
        });

        if (existingUser && existingUser.id !== context.user.id) {
          throw new UserInputError("Email is already in use.");
        }

        const user = await User.findByPk(context.user.id);
        if (!user) {
          throw new UserInputError("User not found");
        }

        user.email = email;
        await user.save();

        return user;
      } catch (error) {
        console.error("Error updating email:", error);
        throw new ApolloError("Failed to update email. Please try again.");
      }
    },

    updatePassword: async (
      parent,
      { currentPassword, newPassword },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const user = await User.findByPk(context.user.id);
        if (!user) {
          throw new UserInputError("User not found");
        }

        const correctPw = await user.checkPassword(currentPassword);
        if (!correctPw) {
          throw new AuthenticationError("Incorrect password!");
        }

        user.password = newPassword;
        await user.save();
        return user;
      } catch (error) {
        console.error("Error updating password:", error);
        throw new ApolloError("Failed to update password. Please try again.");
      }
    },

    createBooking: async (
      parent,
      { escape_room_id, numberOfPlayers, date, time },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const escapeRoom = await EscapeRoom.findByPk(escape_room_id);
        if (!escapeRoom) {
          throw new UserInputError("Escape room not found");
        }

        if (
          numberOfPlayers < escapeRoom.playersMin ||
          numberOfPlayers > escapeRoom.playersMax
        ) {
          throw new UserInputError(
            `Number of players must be between ${escapeRoom.playersMin} and ${escapeRoom.playersMax}`
          );
        }

        const existingBooking = await Booking.findOne({
          where: {
            escape_room_id,
            date,
            time,
          },
        });

        if (existingBooking) {
          throw new UserInputError("This time slot is no longer available");
        }

        const booking = await Booking.create({
          user_id: context.user.id,
          escape_room_id,
          numberOfPlayers,
          date,
          time,
          payment_status: "pending",
        });

        return booking;
      } catch (error) {
        console.error("Error creating booking:", error);
        throw new ApolloError("Failed to create booking. Please try again.");
      }
    },

    deleteBooking: async (parent, { booking_id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const booking = await Booking.findByPk(booking_id);
      if (!booking) {
        throw new UserInputError("Booking not found");
      }

      if (booking.user_id !== context.user.id) {
        throw new ForbiddenError(
          "You don't have permission to delete this booking!"
        );
      }

      try {
        await booking.destroy();
        return true;
      } catch (error) {
        console.error("Error deleting booking:", error);
        throw new ApolloError("Failed to delete booking. Please try again.");
      }
    },
  },
};
