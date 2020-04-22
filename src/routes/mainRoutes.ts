import * as express from "express";
import { Container } from 'typedi';

import { ImageController } from "../controllers/image";
import { StatisticsController } from "../controllers/statistics";

class MainRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    let imageController = Container.get(ImageController);
    let statisticsController = Container.get(StatisticsController);
    this.router.get("/image/*", (req: express.Request, res: express.Response) => imageController.resize(req, res));
    this.router.get("/stats", (req: express.Request, res: express.Response) => statisticsController.getStats(req, res))
  }
}

export const mainRoutes = new MainRoutes().router;