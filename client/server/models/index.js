const User = require("./User");
const EscapeRoom = require("./EscapeRoom");
const Booking = require("./Booking");
const Review = require("./Review");

User.hasMany(Booking, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

User.hasMany(Review, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

EscapeRoom.hasMany(Booking, {
  foreignKey: "escape_room_id",
  onDelete: "CASCADE",
});

EscapeRoom.hasMany(Review, {
  foreignKey: "escape_room_id",
  onDelete: "CASCADE",
});

Booking.belongsTo(User, {
  foreignKey: "user_id",
});

Booking.belongsTo(EscapeRoom, {
  foreignKey: "escape_room_id",
});

Review.belongsTo(User, {
  foreignKey: "user_id",
});

Review.belongsTo(EscapeRoom, {
  foreignKey: "escape_room_id",
});

module.exports = { User, EscapeRoom, Booking, Review };
