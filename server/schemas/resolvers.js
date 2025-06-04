const { Op } = require("sequelize");
const {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ApolloError,
} = require("apollo-server-express");
const { User, EscapeRoom, Booking, Review } = require("../models");
const { signToken } = require("../utils/auth");
const moment = require("moment");

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
                status: "active",
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
            status: "active",
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

    getCompletedBookings: async (parent, args, context) => {
      if (context.user) {
        return await Booking.findAll({
          where: {
            user_id: context.user.id,
            status: "completed",
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
          order: [
            ["date", "DESC"],
            ["time", "DESC"],
          ],
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
          {
            model: User,
            attributes: ["firstName", "lastName", "email"],
          },
        ],
      });

      if (!booking) {
        throw new UserInputError("Booking not found");
      }

      if (booking.user_id !== context.user.id && !context.user.isAdmin) {
        throw new ForbiddenError(
          "You don't have permission to view this booking!"
        );
      }

      return booking;
    },

    getAllBookings: async (parent, args, context) => {
      if (!context.user || !context.user.isAdmin) {
        throw new ForbiddenError("Admin access required");
      }

      return await Booking.findAll({
        include: [
          {
            model: EscapeRoom,
            attributes: ["theme", "price"],
          },
          {
            model: User,
            attributes: ["firstName", "lastName", "email"],
          },
        ],
        order: [["created_at", "DESC"]],
      });
    },

    getAllUsers: async (parent, args, context) => {
      if (!context.user || !context.user.isAdmin) {
        throw new ForbiddenError("Admin access required");
      }

      return await User.findAll({
        attributes: ["id", "firstName", "lastName", "email", "isAdmin"],
        order: [["created_at", "DESC"]],
      });
    },

    getAllReviews: async (parent, args, context) => {
      if (!context.user || !context.user.isAdmin) {
        throw new ForbiddenError("Admin access required");
      }

      return await Review.findAll({
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "email"],
          },
          {
            model: EscapeRoom,
            attributes: ["theme"],
          },
        ],
        order: [["created_at", "DESC"]],
      });
    },

    getReview: async (parent, { id }, context) => {
      if (!context.user || !context.user.isAdmin) {
        throw new ForbiddenError("Admin access required");
      }

      return await Review.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "email"],
          },
          {
            model: EscapeRoom,
            attributes: ["theme"],
          },
        ],
      });
    },
  },

  Mutation: {
    updateBooking: async (parent, { booking_id, input }, context) => {
      if (!context.user || !context.user.isAdmin) {
        throw new ForbiddenError("Admin access required");
      }

      const booking = await Booking.findByPk(booking_id, {
        include: [EscapeRoom],
      });
      if (!booking) {
        throw new UserInputError("Booking not found");
      }

      try {
        if (input.payment_status === "completed" && !booking.payment_amount) {
          input.payment_amount =
            booking.escaperoom.price * booking.numberOfPlayers;
        }

        await booking.update(input);
        return booking;
      } catch (error) {
        console.error("Error updating booking:", error);
        throw new ApolloError("Failed to update booking. Please try again.");
      }
    },

    updateBookingPayment: async (
      parent,
      { booking_id, payment_status, payment_amount, payment_method },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const booking = await Booking.findByPk(booking_id, {
        include: [EscapeRoom],
      });
      if (!booking) {
        throw new UserInputError("Booking not found");
      }

      if (booking.user_id !== context.user.id && !context.user.isAdmin) {
        throw new ForbiddenError(
          "You don't have permission to update this booking!"
        );
      }

      try {
        const fullPrice = booking.escaperoom.price * booking.numberOfPlayers;

        booking.payment_status = payment_status;
        booking.payment_amount = fullPrice;
        booking.payment_method = payment_method;
        await booking.save();

        return booking;
      } catch (error) {
        console.error("Error updating booking payment:", error);
        throw new ApolloError("Failed to update payment. Please try again.");
      }
    },

    completeExpiredBookings: async () => {
      try {
        const now = new Date();
        const bookings = await Booking.findAll({
          where: {
            status: "active",
          },
          include: [EscapeRoom],
        });

        for (const booking of bookings) {
          const bookingDate = new Date(booking.date);
          const bookingTime = booking.time.split(":");
          bookingDate.setHours(bookingTime[0]);
          bookingDate.setMinutes(bookingTime[1]);

          const endTime = new Date(
            bookingDate.getTime() + booking.escaperoom.duration * 60000
          );

          if (now > endTime) {
            if (booking.payment_status === "completed") {
              await booking.update({ status: "completed" });
            } else {
              await booking.update({
                status: "cancelled",
                payment_status: "cancelled",
              });
            }
          }
        }

        return true;
      } catch (error) {
        console.error("Error completing expired bookings:", error);
        throw new ApolloError("Failed to complete expired bookings.");
      }
    },

    deleteUser: async (parent, { id }, context) => {
      if (!context.user || !context.user.isAdmin) {
        throw new ForbiddenError("Admin access required");
      }

      if (context.user.id === id) {
        throw new ForbiddenError("You cannot delete your own account!");
      }

      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new UserInputError("User not found");
        }

        await user.destroy();
        return true;
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new ApolloError("Failed to delete user. Please try again.");
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

        const isAdmin = email === "admin@gmail.com";
        const user = await User.create({
          firstName,
          lastName,
          email,
          password,
          isAdmin,
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
            status: "active",
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
          payment_amount: escapeRoom.price * numberOfPlayers,
          status: "active",
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

      if (booking.user_id !== context.user.id && !context.user.isAdmin) {
        throw new ForbiddenError(
          "You don't have permission to delete this booking!"
        );
      }

      try {
        if (context.user.isAdmin) {
          await booking.destroy();
        } else {
          await booking.update({
            status: "cancelled",
            payment_status: "cancelled",
          });
        }
        return true;
      } catch (error) {
        console.error("Error deleting booking:", error);
        throw new ApolloError("Failed to delete booking. Please try again.");
      }
    },

    createReview: async (
      parent,
      { escape_room_id, rating, comment },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      if (!rating && !comment) {
        throw new UserInputError(
          "Review must contain either a rating or a comment"
        );
      }

      try {
        const review = await Review.create({
          user_id: context.user.id,
          escape_room_id,
          rating,
          comment,
        });

        return review;
      } catch (error) {
        console.error("Error creating review:", error);
        throw new ApolloError("Failed to create review. Please try again.");
      }
    },

    updateReview: async (parent, { id, input }, context) => {
      if (!context.user || !context.user.isAdmin) {
        throw new ForbiddenError("Admin access required");
      }

      try {
        const review = await Review.findByPk(id);
        if (!review) {
          throw new UserInputError("Review not found");
        }

        await review.update(input);
        return review;
      } catch (error) {
        console.error("Error updating review:", error);
        throw new ApolloError("Failed to update review. Please try again.");
      }
    },

    deleteReview: async (parent, { id }, context) => {
      if (!context.user || !context.user.isAdmin) {
        throw new ForbiddenError("Admin access required");
      }

      try {
        const review = await Review.findByPk(id);
        if (!review) {
          throw new UserInputError("Review not found");
        }

        await review.destroy();
        return true;
      } catch (error) {
        console.error("Error deleting review:", error);
        throw new ApolloError("Failed to delete review. Please try again.");
      }
    },

    createEscapeRoom: async (parent, { input }, context) => {
      if (!context.user || !context.user.isAdmin) {
        throw new ForbiddenError("Admin access required");
      }

      try {
        const escapeRoom = await EscapeRoom.create(input);
        return escapeRoom;
      } catch (error) {
        console.error("Error creating escape room:", error);
        throw new ApolloError(
          "Failed to create escape room. Please try again."
        );
      }
    },

    updateEscapeRoom: async (parent, { id, input }, context) => {
      if (!context.user || !context.user.isAdmin) {
        throw new ForbiddenError("Admin access required");
      }

      try {
        const escapeRoom = await EscapeRoom.findByPk(id);
        if (!escapeRoom) {
          throw new UserInputError("Escape room not found");
        }

        await escapeRoom.update(input);
        return escapeRoom;
      } catch (error) {
        console.error("Error updating escape room:", error);
        throw new ApolloError(
          "Failed to update escape room. Please try again."
        );
      }
    },

    deleteEscapeRoom: async (parent, { id }, context) => {
      if (!context.user || !context.user.isAdmin) {
        throw new ForbiddenError("Admin access required");
      }

      try {
        const escapeRoom = await EscapeRoom.findByPk(id);
        if (!escapeRoom) {
          throw new UserInputError("Escape room not found");
        }

        await escapeRoom.destroy();
        return true;
      } catch (error) {
        console.error("Error deleting escape room:", error);
        throw new ApolloError(
          "Failed to delete escape room. Please try again."
        );
      }
    },
  },

  EscapeRoom: {
    averageRating: async (escapeRoom) => {
      const reviews = await Review.findAll({
        where: { escape_room_id: escapeRoom.id },
      });

      if (reviews.length === 0) return null;

      const ratings = reviews
        .filter((review) => review.rating !== null)
        .map((review) => review.rating);

      if (ratings.length === 0) return null;

      const sum = ratings.reduce((a, b) => a + b, 0);
      return sum / ratings.length;
    },
  },

  Review: {
    created_at: (review) => {
      return new Date(review.created_at)
        .toISOString()
        .split("T")[0]
        .split("-")
        .reverse()
        .join(".");
    },
    user: async (review) => {
      return await User.findByPk(review.user_id);
    },
    escaperoom: async (review) => {
      return await EscapeRoom.findByPk(review.escape_room_id);
    },
  },

  Booking: {
    payment_status: (booking) => booking.payment_status || "pending",
    payment_amount: (booking) => booking.payment_amount || 0,
    payment_method: (booking) => booking.payment_method || null,
  },
};

module.exports = resolvers;
