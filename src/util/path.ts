import * as path from "path";
import * as process from 'process';

export class PathUtils {
  private static instance: PathUtils;
  public rootPath: string;
  public imagesPath: string = "C:\\images";

  private constructor() {
    this.rootPath = path.dirname(process.mainModule?.filename ?? "");
  }

  static getInstance(): PathUtils {
    if (!PathUtils.instance) {
      PathUtils.instance = new PathUtils();
    }

    return PathUtils.instance;
  }
}