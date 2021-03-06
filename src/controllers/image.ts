import * as path from "path";
import * as fs from "fs";
import { Service } from "typedi";

import { PathUtils } from "../util/path";
import { ImageService } from "../services/image";
import { Image } from "models/image";
import { MimeTypes } from "../util/mimeTypes"
import { Result } from "../util/result";

@Service()
export class ImageController {

  private imageService: ImageService;
  private pathUtils: PathUtils = PathUtils.getInstance();

  constructor(imageService: ImageService) {
    this.imageService = imageService;
  }

  // Serve and resize requested image
  public async resize(req: any, res: any): Promise<void> {
    let imgName = (req.path as string).replace('/image', '');
    let file = path.join(this.pathUtils.imagesPath, imgName);

    let imgValidation = await this.validateRequestedImage(file);
    if (imgValidation.code != 200) {
      return res.status(imgValidation.code).end(imgValidation.message);
    }

    let imageResult = this.parseRequestQuery(req.query);
    if (imageResult.isFailure) {
      res.set('Content-Type', 'text/plain');
      return res.status(400).end(imageResult.error);
    }

    let image = imageResult.getValue();
    image.path = file;
    let resizedImgPath = await this.imageService.resizeImage(image);

    if (resizedImgPath.isFailure) {
      res.set('Content-Type', 'text/plain');
      return res.status(400).end(resizedImgPath.error);
    }

    let imagePath = resizedImgPath.getValue();
    let extName: string = path.extname(imagePath).slice(1);
    let type = MimeTypes.mime[extName] || 'text/plain';
    let s = fs.createReadStream(imagePath);
    s.on('open', function () {
      res.set('Content-Type', type);
      s.pipe(res);
    });
    s.on('error', function () {
      res.set('Content-Type', 'text/plain');
      res.status(404).end('Not found');
    });
  };

  // Parse query string and validate it for wrong formats
  private parseRequestQuery(queryString: any): Result<Image> {
    let width: number = 0;
    let height: number = 0;
    let imgSize: string = queryString?.size;
    if (imgSize && imgSize.length > 0) {
      let sizes: string[] = imgSize.toLowerCase().split('x');
      if (sizes.length !== 2) {
        return Result.fail('Query parameter size has a bad format! It should be size=(width)x(height)');
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
        return Result.fail(errorMsg);
      }
    }

    let img: Image = { width: width, height: height, path: '' };
    return Result.ok(img);
  }

  // Check if requested image exists and if it can be accessed
  private async validateRequestedImage(filePath: string): Promise<{ message: string, code: number }> {
    if (filePath === this.pathUtils.imagesPath + path.sep) {
      return { message: 'Forbidden', code: 403 };
    }

    try {
      await fs.promises.access(filePath);
    }
    catch (error) {
      return { message: 'Image not found!', code: 400 };
    }

    return { message: '', code: 200 };
  }
}