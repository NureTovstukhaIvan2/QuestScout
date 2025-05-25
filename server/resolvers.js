const {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ApolloError,
} = require("apollo-server-express");
const { User, EscapeRoom, Booking, Review } = require("../models");
const { signToken } = require("../utils/auth");

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 12; i <= 20; i++) {
    slots.push(`${i < 10 ? "0" : ""}${i}:00:00`);
  }
  return slots;
};

const getAvailableSlots = async (escape_room_id, date) => {
  let allSlots = generateTimeSlots();

  const existingBookings = await Booking.findAll({
    where: {
      escape_room_id,
      date,
    },
  });

  if (existingBookings.length === 0) {
    return allSlots;
  }

  const bookedSlots = existingBookings.map((booking) => booking.time);
  const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

  return availableSlots;
};

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
    availableSlots: async (parent, { escape_room_id, date }) => {
      return await getAvailableSlots(escape_room_id, date);
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findByPk(context.user.id);
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
