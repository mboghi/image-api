import * as path from "path";
import * as process from 'process';
import { Service } from "typedi";

@Service()
export class PathUtils {
  public rootPath: string;
  public imagesPath: string = "C:\\Repository\\node\\image-api\\images";

  constructor() {
    this.rootPath = path.dirname(process.mainModule?.filename ?? "");
  }
}