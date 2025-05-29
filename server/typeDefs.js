const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Review {
    id: Int!
    user_id: Int!
    escape_room_id: Int!
    rating: Float
    comment: String
    created_at: String!
    user: User
  }

  type EscapeRoom {
    id: Int!
    theme: String!
    genre: String!
    difficulty: String!
    ageGroup: String!
    playersMin: Int!
    playersMax: Int!
    price: Int!
    description: String!
    duration: Int!
    image_url: String!
    reviews: [Review]
    averageRating: Float
  }

  type Booking {
    id: Int!
    user_id: Int!
    escape_room_id: Int!
    numberOfPlayers: Int!
    date: String!
    time: String!
    created_at: String!
    payment_status: String!
    payment_amount: Float!
    payment_method: String
    escaperoom: EscapeRoom
  }

  type AvailableSlot {
    date: String!
    time: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    getAllEscapeRooms: [EscapeRoom]
    getEscapeRoom(id: Int!): EscapeRoom
    availableSlots(
      escape_room_id: Int!
      start_date: String!
      end_date: String!
    ): [AvailableSlot]!
    getSingleBooking(booking_id: Int!): Booking
    getAllUserBookings: [Booking]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): Auth
    updateEmail(email: String!): User
    updatePassword(currentPassword: String!, newPassword: String!): User
    createBooking(
      escape_room_id: Int!
      numberOfPlayers: Int!
      date: String!
      time: String!
    ): Booking
    updateBookingPayment(
      booking_id: Int!
      payment_status: String!
      payment_amount: Float!
      payment_method: String!
    ): Booking
    deleteBooking(booking_id: Int!): Boolean!
    createReview(escape_room_id: Int!, rating: Float, comment: String): Review
  }
`;

module.exports = typeDefs;
