import * as path from "path";
import * as jimp from "jimp";
import * as fs from 'fs';
import { Service } from "typedi";

import { Image } from "models/image";

@Service()
export class ImageService {

  public async resizeImage(imageSpecs: Image): Promise<string> {
    let extension = path.extname(imageSpecs.path);
    let resizedExt: string = extension;
    if (imageSpecs.width > 0 && imageSpecs.height > 0) {
      resizedExt = `_${imageSpecs.width}x${imageSpecs.height}${extension}`;
    }
    let newImgPath = imageSpecs.path.replace(extension, resizedExt);

    try {
      await fs.promises.access(newImgPath);
    }
    catch (error) {
      const image = await jimp.read(imageSpecs.path);
      if (resizedExt !== extension) {
        image.resize(imageSpecs.width, imageSpecs.height);
      }
      await image.writeAsync(newImgPath);
    }

    return newImgPath;
  }
}