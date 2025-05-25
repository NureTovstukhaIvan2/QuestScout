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

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    getAllEscapeRooms: [EscapeRoom]
    getEscapeRoom(id: Int!): EscapeRoom
    availableSlots(escape_room_id: Int!, date: String!): [String!]
    getSingleBooking(booking_id: Int!): Booking
    getAllUserBookings: [Booking]
  }



module.exports = typeDefs;
