
require("dotenv").config();
const connectDB = require("./db/index");

const port = process.env.PORT;

const app = require("./app");

const default_port = 3000;

connectDB()
  .then(() => {
    app.listen(port || default_port, () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error in initializing the server");
  });
