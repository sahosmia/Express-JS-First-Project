const config = require("./config/config");
const app = require("./app");

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
