import * as path from "path";
import * as jimp from "jimp";
import * as fs from 'fs';
import { Service } from "typedi";

@Service()
export class ImageService {

  public async resizeImage(imgPath: string, width: number, height: number): Promise<string> {
    let extension = path.extname(imgPath);
    let resizedExt: string = extension;
    if (width > 0 && height > 0) {
      resizedExt = `_${width}x${height}${extension}`;
    }
    let newImgPath = imgPath.replace(extension, resizedExt);

    try {
      await fs.promises.access(newImgPath);
    }
    catch (error) {
      const image = await jimp.read(imgPath);
      if (resizedExt !== extension) {
        image.resize(width, height);
      }
      await image.writeAsync(newImgPath);
    }

    return newImgPath;
  }
}