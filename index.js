const express = require("express");
const app = express();
const passport = require("passport");
const http = require("http").Server(app);
const mongoose = require("mongoose");
const chalk = require("chalk");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const Agenda = require("agenda");
const { port, hostIP } = require("./config/keys").host;
const bodyParser = require("body-parser");
const io = require("socket.io")(http, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5002",
      "http://localhost:5002/",
      "http://localhost:3000/",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3000/",
      "http://127.0.0.1:8000/",
      "http://127.0.0.1:8001/",
      "http://127.0.0.1:8001",
      "http://localhost:3000/auth-verify",
      "http://localhost:3000/auth-verify?",
    ],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

const routes = require("./routes");
require("./services/passport");
app.use(passport.initialize());
const socketMessaging = require("./socket/messaging");

const { database } = require("./config/keys");
const expireBounty = require("./services/expireBounty");
const startBounty = require("./services/startBounty");

const agenda = new Agenda({
  db: {
    address: database,
  },
  collection: "agendas",
});
agenda.start();

agenda.define("expireBounty", async () => {
  expireBounty();
});

module.exports.schedule = (date) => {
  console.log("date", date);
  agenda.schedule(date, "expireBounty");
};
agenda.define("startBounty", async () => {
  startBounty();
});
module.exports.startSchedule = (date) => {
  agenda.schedule(date, "startBounty");
};

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(express.json({ limit: "50mb", extended: true }));

app.use(express.urlencoded({ limit: "50mb", extended: true }));
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3000/",
    "http://localhost:8000",
    "http://localhost:5002",
    "http://localhost:5002/",
    "http://localhost:8000/",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3000/",
    "http://localhost:8001/",
    "http://localhost:8001",
    "http://localhost:3000/auth-verify",
    "http://localhost:3000/auth-verify?",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(morgan("combined"));

app.use(routes);

// app.use(passport.initialize());
// app.use(passport.session());

// Connect to MongoDB
// module.exports = scheduleJob;
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.log(`${chalk.green("✓")} ${chalk.blue("MongoDB Connected!")}`)
  )
  .then(() => {
    http.listen(port, hostIP, () => {
      console.log(
        `${chalk.green("✓")} ${chalk.blue(
          "Server Started on port"
        )} http://${chalk.bgMagenta.white(hostIP)}:${chalk.bgMagenta.white(
          port
        )}`
      );
    });
    socketMessaging(io);
  })
  .catch((err) => console.log(err));
