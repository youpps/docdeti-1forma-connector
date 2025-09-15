import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { Controllers } from "./controllers";
import { Repositories } from "./repositories";
import { routes } from "./routes";

dotenv.config();

const APP_PORT = process.env.APP_PORT;
const ONE_FORMA_LOGIN = process.env.ONE_FORMA_LOGIN ?? "";
const ONE_FORMA_PASSWORD = process.env.ONE_FORMA_PASSWORD ?? "";
const ONE_FORMA_URL = process.env.ONE_FORMA_URL ?? "";
const ONE_FORMA_SUBCAT_ID = Number(process.env.ONE_FORMA_SUBCAT_ID ?? 0);
const ONE_FORMA_DEFAULT_USER_ID = Number(process.env.ONE_FORMA_DEFAULT_USER_ID ?? 0);

async function start() {
  try {
    const app = express();

    const repositories = new Repositories({
      url: ONE_FORMA_URL,
      defaultUserId: ONE_FORMA_DEFAULT_USER_ID,
      login: ONE_FORMA_LOGIN,
      password: ONE_FORMA_PASSWORD,
      subcatId: ONE_FORMA_SUBCAT_ID,
    });
    const controllers = new Controllers(repositories);

    app.use(
      express.urlencoded({
        extended: true,
      })
    );

    app.use(
      express.json({
        limit: "30kb",
      })
    );

    app.use(morgan("dev"));

    app.use(cors());

    app.use("/api", routes(controllers));

    app.listen(APP_PORT, () => {
      console.log(`http://localhost:${APP_PORT}`);
    });
  } catch (e) {
    console.log("Something went wrong: ", e);
  }
}

start();
