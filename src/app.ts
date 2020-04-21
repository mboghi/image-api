import "reflect-metadata";
import express from "express";
import * as bodyParser from "body-parser";
import { mainRoutes } from "./routes/mainRoutes";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use("/image", mainRoutes);

    this.app.use((eq, res, next) => {
      res.status(404).end();
    });

  }
}

export default new App().app;