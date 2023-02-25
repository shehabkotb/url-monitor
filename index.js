const app = require("./app");
const config = require("./config/config");

app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}...`);
});
