import * as express from "express";
import { Container } from 'typedi';

import { ImageController } from "../controllers/image";

class MainRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {
    let imageController = Container.get(ImageController);
    this.router.get("*", (req: express.Request, res: express.Response) => imageController.resize(req, res));
  }
}

export const mainRoutes = new MainRoutes().router;