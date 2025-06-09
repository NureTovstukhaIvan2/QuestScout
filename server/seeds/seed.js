const sequelize = require("../config/connection");
const { User } = require("../models");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.create({
    firstName: "Admin",
    lastName: "User",
    email: "admin@gmail.com",
    password: "11111111",
    isAdmin: true,
  });

  process.exit(0);
};

seedDatabase();
