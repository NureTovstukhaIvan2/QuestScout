import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query userMe {
    me {
      id
      firstName
      lastName
      email
      isAdmin
    }
  }
`;

export const QUERY_AllESCAPEROOMS = gql`
  query getAllEscapeRooms {
    getAllEscapeRooms {
      id
      theme
      genre
      difficulty
      ageGroup
      playersMin
      playersMax
      price
      description
      duration
      image_url
      averageRating
      reviews {
        id
        rating
        comment
        reply
        created_at
      }
    }
  }
`;

export const QUERY_ESCAPEROOM = gql`
  query getEscapeRoom($id: Int!) {
    getEscapeRoom(id: $id) {
      id
      theme
      genre
      difficulty
      ageGroup
      playersMin
      playersMax
      price
      description
      duration
      image_url
      averageRating
      reviews {
        id
        rating
        comment
        reply
        created_at
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const QUERY_AVAILABLESLOTS = gql`
  query availableSlots(
    $escape_room_id: Int!
    $start_date: String!
    $end_date: String!
  ) {
    availableSlots(
      escape_room_id: $escape_room_id
      start_date: $start_date
      end_date: $end_date
    ) {
      date
      time
    }
  }
`;

export const QUERY_SINGLEBOOKING = gql`
  query getSingleBooking($booking_id: Int!) {
    getSingleBooking(booking_id: $booking_id) {
      id
      user_id
      escape_room_id
      numberOfPlayers
      date
      time
      created_at
      payment_status
      payment_amount
      payment_method
      escaperoom {
        theme
        price
      }
    }
  }
`;

export const QUERY_USERBOOKINGS = gql`
  query getAllUserBookings {
    getAllUserBookings {
      id
      user_id
      escape_room_id
      numberOfPlayers
      date
      time
      payment_status
      payment_amount
      payment_method
      created_at
      escaperoom {
        theme
        genre
        difficulty
        ageGroup
        playersMin
        playersMax
        price
        duration
        description
        image_url
      }
    }
  }
`;

export const QUERY_COMPLETEDBOOKINGS = gql`
  query getCompletedBookings {
    getCompletedBookings {
      id
      user_id
      escape_room_id
      numberOfPlayers
      date
      time
      payment_status
      payment_amount
      payment_method
      created_at
      escaperoom {
        theme
        genre
        difficulty
        ageGroup
        playersMin
        playersMax
        price
        duration
        description
        image_url
      }
    }
  }
`;

export const QUERY_ALLBOOKINGS = gql`
  query getAllBookings {
    getAllBookings {
      id
      user_id
      escape_room_id
      numberOfPlayers
      date
      time
      payment_status
      payment_amount
      payment_method
      created_at
      escaperoom {
        theme
      }
      user {
        firstName
        lastName
        email
      }
    }
  }
`;

export const QUERY_ALLUSERS = gql`
  query getAllUsers {
    getAllUsers {
      id
      firstName
      lastName
      email
      isAdmin
    }
  }
`;

export const QUERY_ALLREVIEWS = gql`
  query getAllReviews {
    getAllReviews {
      id
      user_id
      escape_room_id
      rating
      comment
      reply
      created_at
      user {
        firstName
        lastName
        email
      }
      escaperoom {
        theme
      }
    }
  }
`;

export const GET_REVIEW = gql`
  query getReview($id: Int!) {
    getReview(id: $id) {
      id
      user_id
      escape_room_id
      rating
      comment
      reply
      created_at
      user {
        firstName
        lastName
        email
      }
      escaperoom {
        theme
      }
    }
  }
`;
