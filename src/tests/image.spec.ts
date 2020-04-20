import * as path from "path";
import { expect } from "chai";
import "mocha";
import Container from "typedi";

import { ImageService } from "../services/image";
import rootDir from "../util/path";

describe("Image function", () => {
  it('should return image', async () => {
    var req = {
      "path": "elephant.jpg",
      "query": {
        "width": 200,
        "height": 200
      }
    };
    var imgDir = path.join(rootDir, '..', '..', '..', 'images');
    var imgPath = path.join(imgDir, 'plane.jfif');
    var imageService = Container.get(ImageService);
    const rsImgPath = await imageService.resizeImage(imgPath, 200, 200);

    expect(rsImgPath).to.equal(path.join(imgDir, 'plane_200x200.jfif'));
  });
});