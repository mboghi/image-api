import { CachedImage } from "models/stats";

export class UsageStats {
  public cachedImages: CachedImage[];
  private static instance: UsageStats;


  private constructor() {
    this.cachedImages = [];
  }

  public static getInstance() {
    if (!UsageStats.instance) {
      UsageStats.instance = new UsageStats();
    }
    return UsageStats.instance;
  }

  public resizedImagesNo(): number {
    return this.cachedImages.length - this.originalImagesNo();
  }

  public originalImagesNo(): number {
    return this.cachedImages.filter((item) => item.isOriginal).length;
  }
}