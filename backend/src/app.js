const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddlewear = require("./middlewears/errorMiddlewear.js");
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

const authRouter = require("./routes/authRouter.js");
const componentsRouter = require("./routes/componentsRouter.js");
const requestsRouter = require("./routes/requestsRouter.js");

app.use("/auth", authRouter);
app.use("/components", componentsRouter);
app.use("/requests", requestsRouter);
app.use(errorMiddlewear);

module.exports = app;
