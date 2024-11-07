require("dotenv").config();

const dev = {
  server: {
    port: process.env.PORT || 3000,
  },

  db: {
    url: process.env.MONGO_URI || "mongodb://localhost:27017/souda_travel",
  },
};

module.exports = dev;
