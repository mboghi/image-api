import * as path from "path";
import { expect } from "chai";
import chai from "chai";
import chaiHttp from 'chai-http';
import "mocha";
import Container from "typedi";

import { ImageService } from "../services/image";
import server from "../app";
import { PathUtils } from "../util/path";
import { Image } from "models/image";

let pathUtils = PathUtils.getInstance();
let should = chai.should();
chai.use(chaiHttp);

describe("Image service function", () => {
  it('should return resized image path', async () => {
    let req = {
      "path": "elephant.jpg",
      "query": {
        "width": 200,
        "height": 200
      }
    };
    let imgPath = path.join(pathUtils.imagesPath, 'plane.jfif');
    let imageService = Container.get(ImageService);
    let img: Image = { path: imgPath, width: 200, height: 200 };
    const rsImgPath = await imageService.resizeImage(img);

    expect(rsImgPath).to.equal(path.join(pathUtils.imagesPath, 'plane_200x200.jfif'));
  });
});

describe('Get images', () => {
  it('should return resized images', (done) => {
    chai.request(server)
      .get('/image/elephant.jpg?size=300x800')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  })
});

describe('Get images stress', () => {
  let runs = [...Array(50).keys()].map(i => i + 400);

  runs.forEach((run) => {
    it(`should return resized images #${run - 400}`, (done) => {
      chai.request(server)
        .get(`/image/elephant.jpg?size=300x${run}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});