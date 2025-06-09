import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
      user {
        id
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation updateBooking($booking_id: Int!, $input: UpdateBookingInput!) {
    updateBooking(booking_id: $booking_id, input: $input) {
      id
      payment_status
      payment_amount
      payment_method
    }
  }
`;

export const UPDATE_BOOKING_PAYMENT = gql`
  mutation updateBookingPayment(
    $booking_id: Int!
    $payment_status: String!
    $payment_amount: Float!
    $payment_method: String!
  ) {
    updateBookingPayment(
      booking_id: $booking_id
      payment_status: $payment_status
      payment_amount: $payment_amount
      payment_method: $payment_method
    ) {
      id
      payment_status
      payment_amount
      payment_method
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const UPDATE_EMAIL = gql`
  mutation updateEmail($email: String!) {
    updateEmail(email: $email) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const UPDATE_NAME = gql`
  mutation updateName($input: UpdateNameInput!) {
    updateName(input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation updatePassword($currentPassword: String!, $newPassword: String!) {
    updatePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation createBooking(
    $escape_room_id: Int!
    $numberOfPlayers: Int!
    $date: String!
    $time: String!
  ) {
    createBooking(
      escape_room_id: $escape_room_id
      numberOfPlayers: $numberOfPlayers
      date: $date
      time: $time
    ) {
      id
      user_id
      escape_room_id
      numberOfPlayers
      date
      time
      created_at
      payment_status
    }
  }
`;

export const DELETE_BOOKING = gql`
  mutation deleteBooking($booking_id: Int!) {
    deleteBooking(booking_id: $booking_id)
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

export const CREATE_REVIEW = gql`
  mutation createReview(
    $escape_room_id: Int!
    $rating: Float
    $comment: String
  ) {
    createReview(
      escape_room_id: $escape_room_id
      rating: $rating
      comment: $comment
    ) {
      id
      user_id
      escape_room_id
      rating
      comment
      created_at
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation updateReview($id: Int!, $input: UpdateReviewInput!) {
    updateReview(id: $id, input: $input) {
      id
      reply
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation deleteReview($id: Int!) {
    deleteReview(id: $id)
  }
`;

export const CREATE_ESCAPEROOM = gql`
  mutation createEscapeRoom($input: EscapeRoomInput!) {
    createEscapeRoom(input: $input) {
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
    }
  }
`;

export const UPDATE_ESCAPEROOM = gql`
  mutation updateEscapeRoom($id: Int!, $input: EscapeRoomInput!) {
    updateEscapeRoom(id: $id, input: $input) {
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
    }
  }
`;

export const DELETE_ESCAPEROOM = gql`
  mutation deleteEscapeRoom($id: Int!) {
    deleteEscapeRoom(id: $id)
  }
`;
