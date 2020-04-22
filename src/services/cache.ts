import path from 'path';
import fs from 'fs';

import { PathUtils } from '../util/path';
import { UsageStats } from '../util/stats';
import { Service } from 'typedi';

@Service()
export class ImagesCache {
  private pathUtils: PathUtils = PathUtils.getInstance();
  private usageStats: UsageStats = UsageStats.getInstance();

  public async performCacheCleanup(): Promise<void> {
    fs.readdir(this.pathUtils.imagesPath, (err, files) => {
      files.forEach(async (file: string, index: number) => {
        let existingItems = this.usageStats.cachedImages.filter((item) => item.path === file);
        if (existingItems.length === 0) {
          this.usageStats.cachedImages.push({
            isOriginal: true,
            hits: 0,
            newHits: 0,
            path: file
          });
          return;
        }
        let existingItem = existingItems[0];
        if (existingItem.newHits === 0 && !existingItem.isOriginal) {
          fs.unlink(path.join(this.pathUtils.imagesPath, file), (err) => {
            if (err) {
              console.log(err);
            }
          });
          this.usageStats.cachedImages.splice(this.usageStats.cachedImages.indexOf(existingItem), 1);
          return;
        }
        existingItem.hits += existingItem.newHits;
        existingItem.newHits = 0;
      });
    });
  }

  public async addResizedImage(resizedImagePath: string): Promise<void> {
    resizedImagePath = resizedImagePath.replace(this.pathUtils.imagesPath + '\\', '');
    let existingItems = this.usageStats.cachedImages.filter((item) => item.path === resizedImagePath);
    if (existingItems.length == 1) {
      existingItems[0].newHits += 1;
      return;
    }
    this.usageStats.cachedImages.push({
      hits: 0,
      newHits: 1,
      isOriginal: false,
      path: resizedImagePath
    });
  }

  public async addNewImage(newImagePath: string): Promise<void> {
    newImagePath = newImagePath.replace(this.pathUtils.imagesPath + '\\', '');
    let existingItems = this.usageStats.cachedImages.filter((item) => item.path === newImagePath);
    if (existingItems.length == 1) {
      existingItems[0].newHits += 1;
      return;
    }
    this.usageStats.cachedImages.push({
      hits: 0,
      newHits: 1,
      isOriginal: true,
      path: newImagePath
    });
  }
}