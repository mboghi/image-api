import { CachedImage } from "models/stats";

export class UsageStats {
  public cachedImages: CachedImage[];
  private static instance: UsageStats;
  public resizedImagesNo: number;
  public hits: number;
  public misses: number;

  private constructor() {
    this.cachedImages = [];
    this.resizedImagesNo = 0;
    this.hits = 0;
    this.misses = 0;
  }

  public static getInstance() {
    if (!UsageStats.instance) {
      UsageStats.instance = new UsageStats();
    }
    return UsageStats.instance;
  }

  public originalImagesNo(): number {
    return this.cachedImages.filter((item) => item.isOriginal).length;
  }
}