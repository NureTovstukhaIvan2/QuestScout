const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Booking extends Model {}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    escape_room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "escaperooms",
        key: "id",
      },
    },
    numberOfPlayers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      defaultValue: "pending",
    },
    payment_amount: {
      type: DataTypes.FLOAT,
    },
    payment_method: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("active", "completed", "cancelled"),
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "booking",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Booking;
