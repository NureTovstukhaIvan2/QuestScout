const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { OAuth2Client } = require("google-auth-library");
const { User } = require("./models");
const { signToken } = require("./utils/auth");
const bodyParser = require("body-parser");
const cron = require("node-cron");

const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");
const sequelize = require("./config/connection");

require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const googleClient = new OAuth2Client(
  "671664117284-v6heu97v1bdv3tm00n31jjicmtvabusl.apps.googleusercontent.com"
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

cron.schedule("0 * * * *", async () => {
  try {
    console.log("Running scheduled task to complete expired bookings...");
    const { completeExpiredBookings } = resolvers.Mutation;
    await completeExpiredBookings();
    console.log("Completed processing expired bookings");
  } catch (err) {
    console.error("Error in scheduled task:", err);
  }
});

app.post("/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience:
        "671664117284-v6heu97v1bdv3tm00n31jjicmtvabusl.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        firstName: given_name || "Google",
        lastName: family_name || "User",
        email,
        password: Math.random().toString(36).slice(-8),
      });
    }

    const token = signToken(user);
    res.json({ token });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ error: "Google authentication failed" });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

const startApolloServer = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app });

    await sequelize.sync({ force: false });

    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
};

startApolloServer();
