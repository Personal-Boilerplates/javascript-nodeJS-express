import "dotenv/config.js";
import "./config/Custom/index.js";

import express from "express";
import cors from "cors";
import "express-async-errors";
import Youch from "youch";

import "./database/index.js";
import routes from "./routes.js";

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      if (process.env.NODE_ENV === "production") {
        try {
          const handleError = errors.error.message
            .replace(/\n/g, "")
            .split(",");
          console.log(handleError);
          return res.status(500).json({ error: handleError });
        } catch {
          return res
            .status(500)
            .json({ error: ["Aconteceu um erro inesperado"] });
        }
      }

      return res.status(500).json(errors);
    });
  }
}

export default new App().server;
