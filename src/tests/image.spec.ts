import * as path from "path";
import { expect } from "chai";
import chai from "chai";
import chaiHttp from 'chai-http';
import "mocha";
import Container from "typedi";
import sinon from "sinon";
import fs from 'fs';

import { ImageService } from "../services/image";
import server from "../app";
import { PathUtils } from "../util/path";
import { Image } from "models/image";
import { UsageStats } from "../util/stats";
import * as ImagesCacheStub from "../services/cache";
import { ImagesCache } from "../services/cache";

let pathUtils = PathUtils.getInstance();
let should = chai.should();
let imgNames: string[] = [];

chai.use(chaiHttp);

describe("Image Service Positive", () => {
  before(() => {
    sinon.stub(ImagesCacheStub, 'ImagesCache').returns(new ImagesCache());
  });

  after(async () => {
    await imgNames.forEach(async (img) => {
      await fs.unlink(path.join(pathUtils.imagesPath, img), (err) => { });
    });
    imgNames = [];
  });

  it('should return resized image path', async () => {
    let req = {
      "path": "elephant.jpg",
      "query": {
        "width": 200,
        "height": 200
      }
    };
    let imgName = 'plane.jfif';
    let expectedImgName = 'plane_200x200.jfif';
    imgNames.push(expectedImgName);
    let imgPath = path.join(pathUtils.imagesPath, imgName);
    let imageService = Container.get(ImageService);
    let img: Image = { path: imgPath, width: 200, height: 200 };
    const rsImgPath = await (await imageService.resizeImage(img)).getValue();

    expect(rsImgPath).to.equal(path.join(pathUtils.imagesPath, expectedImgName));
  });

  let runs = [...Array(5).keys()].map(i => i + 400);

  runs.forEach((run) => {
    it(`should return resized images #${run - 400}`, (done) => {
      let size = `300x${run}`;
      imgNames.push(`elephant_${size}.jpg`);
      chai.request(server)
        .get(`/image/elephant.jpg?size=${size}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});

describe("Image Service Negative", () => {
  it("should fail with bad image", (done) => {
    chai.request(server)
      .get(`/image/12345.jpg?size=300x400`)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("should fail with bad query", (done) => {
    chai.request(server)
      .get(`/image/elephant.jpg?size=3s0x4dd`)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("should fail with forbidden access", (done) => {
    chai.request(server)
      .get(`/image/`)
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });
});

describe("Statistics Service Positive", () => {

  it(`should return stats`, (done) => {
    chai.request(server)
      .get(`/stats`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.hits_vs_Misses).to.equal('0/6');
        expect(res.body.originalImagesNo).to.equal(4);
        expect(res.body.resizedImagesNo).to.equal(6);
        done();
      });
  });
});