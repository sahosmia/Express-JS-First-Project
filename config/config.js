require("dotenv").config();

const dev = {
  server: {
    port: process.env.PORT || 5000,
  },

  db: {
    url: process.env.MONGO_URI || "mongodb://localhost:27017/souda_travel",
  },
  secret: {
    jwt_secret: process.env.JWT_SECRETS,
  },
};

module.exports = dev;
