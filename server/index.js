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
