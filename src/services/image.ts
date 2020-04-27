import * as path from "path";
import * as jimp from "jimp";
import * as fs from 'fs';
import Container, { Service } from "typedi";

import { Image } from "../models/image";
import { ImagesCache } from "./cache";
import { Result } from "../util/result";

@Service()
export class ImageService {
  public cache: ImagesCache = Container.get(ImagesCache);

  // Resize image to specified size
  public async resizeImage(imageSpecs: Image): Promise<Result<string>> {

    let newImgPath = this.composeNewImagePath(imageSpecs);

    let imageIsAccessible = await this.checkImageIsAccessible(newImgPath);

    try {
      if (!imageIsAccessible) {
        await this.prepareNewResizedImage(imageSpecs, newImgPath);
      }
    } catch (error) {
      return Result.fail(error.message);
    }

    return Result.ok(newImgPath);
  }

  private composeNewImagePath(imageSpecs: Image): string {
    let extension = path.extname(imageSpecs.path);
    let resizedExt: string = extension;
    if (imageSpecs.width > 0 && imageSpecs.height > 0) {
      resizedExt = `_${imageSpecs.width}x${imageSpecs.height}${extension}`;
    }
    return imageSpecs.path.replace(extension, resizedExt);
  }

  private async prepareNewResizedImage(imageSpecs: Image, newImgPath: string): Promise<void> {
    const image = await jimp.read(imageSpecs.path);
    let needsResize = imageSpecs.path !== newImgPath;
    if (needsResize) {
      image.resize(imageSpecs.width, imageSpecs.height);
      this.cache.addResizedImage(newImgPath);
    }
    else {
      this.cache.addNewImage(newImgPath);
    }
    await image.writeAsync(newImgPath);
  }

  private async checkImageIsAccessible(imgPath: string): Promise<boolean> {
    try {
      await fs.promises.access(imgPath);
      return true;
    }
    catch (error) {
      return false;
    }
  }
}
