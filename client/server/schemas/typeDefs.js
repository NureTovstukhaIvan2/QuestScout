const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    isAdmin: Boolean!
  }

  type Review {
    id: Int!
    user_id: Int!
    escape_room_id: Int!
    rating: Float
    comment: String
    reply: String
    created_at: String!
    user: User
    escaperoom: EscapeRoom
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
    status: String!
    escaperoom: EscapeRoom
    user: User
  }

  type AvailableSlot {
    date: String!
    time: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  input EscapeRoomInput {
    theme: String!
    genre: String!
    difficulty: String!
    ageGroup: String!
    playersMin: Int!
    playersMax: Int!
    price: Int!
    description: String!
    duration: Int!
    image_url: String
  }

  input UpdateBookingInput {
    payment_status: String
    payment_amount: Float
    payment_method: String
    status: String
  }

  input UpdateReviewInput {
    reply: String
  }

  input UpdateNameInput {
    firstName: String!
    lastName: String!
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
    getCompletedBookings: [Booking]
    getAllBookings: [Booking]
    getAllUsers: [User]
    getAllReviews: [Review]
    getReview(id: Int!): Review
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
    updateName(input: UpdateNameInput!): User
    createBooking(
      escape_room_id: Int!
      numberOfPlayers: Int!
      date: String!
      time: String!
    ): Booking
    updateBooking(booking_id: Int!, input: UpdateBookingInput!): Booking
    updateBookingPayment(
      booking_id: Int!
      payment_status: String!
      payment_amount: Float!
      payment_method: String!
    ): Booking
    completeExpiredBookings: Boolean
    deleteBooking(booking_id: Int!): Boolean!
    createReview(escape_room_id: Int!, rating: Float, comment: String): Review
    updateReview(id: Int!, input: UpdateReviewInput!): Review
    deleteReview(id: Int!): Boolean!
    createEscapeRoom(input: EscapeRoomInput!): EscapeRoom
    updateEscapeRoom(id: Int!, input: EscapeRoomInput!): EscapeRoom
    deleteEscapeRoom(id: Int!): Boolean!
    deleteUser(id: Int!): Boolean!
  }
`;

module.exports = typeDefs;
