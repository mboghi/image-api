import * as path from "path";
import * as fs from "fs";
import { Service } from "typedi";

import { PathUtils } from "../util/path";
import { ImageService } from "../services/image";

const mime: { [key: string]: string } = {
  html: 'text/html',
  txt: 'text/plain',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  js: 'application/javascript'
};

@Service()
export class ImageController {
  private imageService: ImageService;
  private pathUtils: PathUtils;

  constructor(imageService: ImageService, pathUtils: PathUtils) {
    this.imageService = imageService;
    this.pathUtils = pathUtils;
  }

  public async resize(req: any, res: any): Promise<void> {
    let file = path.join(this.pathUtils.imagesPath, req.path);
    if (file.indexOf(this.pathUtils.imagesPath + path.sep) !== 0) {
      return res.status(403).end('Forbidden');
    }

    let width: number = 0;
    let height: number = 0;
    let imgSize: string = req.query?.size;
    if (imgSize && imgSize.length > 0) {
      let sizes: string[] = (req.query.size as string)?.toLowerCase().split('x');
      if (sizes.length !== 2) {
        res.set('Content-Type', 'text/plain');
        return res.status(400).end('Query parameter size has a bad format! It should be size=(width)x(height)');
      }
      let errorMsg: string = "";
      width = Number(sizes[0]);
      if (Number.isNaN(width) || width <= 0) {
        errorMsg = `Value ${sizes[0]} for width is not a valid number.`;
      }
      height = Number(sizes[1]);
      if (Number.isNaN(height) || height <= 0) {
        errorMsg += `\nValue ${sizes[1]} for height is not a valid number.`;
      }
      if (errorMsg !== "") {
        res.set('Content-Type', 'text/plain');
        return res.status(400).end(errorMsg);
      }
    }

    let imgPath = await this.imageService.resizeImage(file, width, height);

    let extName: string = path.extname(imgPath).slice(1);
    let type = mime[extName] || 'text/plain';
    let s = fs.createReadStream(imgPath);
    s.on('open', function () {
      res.set('Content-Type', type);
      s.pipe(res);
    });
    s.on('error', function () {
      res.set('Content-Type', 'text/plain');
      res.status(404).end('Not found');
    });
  };
}