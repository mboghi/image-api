import * as path from "path";
import * as jimp from "jimp";
import { Service } from "typedi";

@Service()
export class ImageService {

  public async resizeImage(imgPath: string, width: number, height: number): Promise<string> {
    var extension = path.extname(imgPath);
    var newImgPath = imgPath.replace(extension, '_' + width + 'x' + height + extension)

    const image = await jimp.read(imgPath);
    image.resize(width, height);
    await image.writeAsync(newImgPath);

    return newImgPath;
  }
}