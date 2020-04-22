import "reflect-metadata";
import express from "express";
import * as bodyParser from "body-parser";

import { mainRoutes } from "./routes/mainRoutes";
import { ImagesCache } from "./services/cache";

class App {
  public app: express.Application;
  private cache: ImagesCache;

  constructor() {
    this.app = express();
    this.cache = new ImagesCache();
    this.config();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(mainRoutes);

    this.app.use((eq, res, next) => {
      res.status(404).end();
    });

    this.cache.performCacheCleanup();
  }
}

export default new App().app;