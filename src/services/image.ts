import * as path from "path";
import * as jimp from "jimp";
import * as fs from 'fs';
import { Service } from "typedi";

import { Image } from "../models/image";
import { ImagesCache } from "./cache";

@Service()
export class ImageService {
  private cache: ImagesCache;

  constructor(imagesCache: ImagesCache) {
    this.cache = imagesCache;
  }

  public async resizeImage(imageSpecs: Image): Promise<string> {
    let extension = path.extname(imageSpecs.path);
    let resizedExt: string = extension;
    if (imageSpecs.width > 0 && imageSpecs.height > 0) {
      resizedExt = `_${imageSpecs.width}x${imageSpecs.height}${extension}`;
    }
    let newImgPath = imageSpecs.path.replace(extension, resizedExt);

    try {
      await fs.promises.access(newImgPath);
      this.cache.addNewImage(newImgPath);
    }
    catch (error) {
      const image = await jimp.read(imageSpecs.path);
      if (resizedExt !== extension) {
        image.resize(imageSpecs.width, imageSpecs.height);
        this.cache.addResizedImage(newImgPath);
      }
      else {
        this.cache.addNewImage(newImgPath);
      }
      await image.writeAsync(newImgPath);
    }

    return newImgPath;
  }
}