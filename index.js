import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import CatatanRoute from "./routes/CatatanRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import FaqRoute from "./routes/FaqRoute.js";
import TeamRoute from "./routes/TeamRoute.js";
import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";
import db from "./config/Database.js";
dotenv.config();

const app = express();

const sessionStore = new SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(UserRoute);
app.use(CatatanRoute);
app.use(AuthRoute);
app.use(FaqRoute);
app.use(FileUpload());
app.use(express.static("public"));
app.use(TeamRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("server is running up");
});
