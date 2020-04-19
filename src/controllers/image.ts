import * as path from "path";
import * as jimp from "jimp";
import * as fs from "fs";

import rootDir from "../util/path";

var mime: { [key: string]: string } = {
  html: 'text/html',
  txt: 'text/plain',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  js: 'application/javascript'
};

export class ImageController {
  private imgDir: string;

  constructor() {
    console.log("Root Dir");
    console.log(rootDir);
    this.imgDir = path.join(rootDir, '..', 'images');
  }

  public async resize(req: any, res: any): Promise<void> {
    var file = path.join(this.imgDir, req.path);
    if (file.indexOf(this.imgDir + path.sep) !== 0) {
      return res.status(403).end('Forbidden');
    }

    var width = Number(req.query.width);
    var height = Number(req.query.height);
    var extension = path.extname(file);
    var imgPath = file.replace(extension, '_' + width + 'x' + height + extension)

    const image = await jimp.read(file);
    if (width && height) {
      image.resize(width, height);
    }
    await image.writeAsync(imgPath);

    var extName: string = path.extname(imgPath).slice(1);
    var type = mime[extName] || 'text/plain';
    var s = fs.createReadStream(imgPath);
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

export const imageController = new ImageController();