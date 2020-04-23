import { Service } from "typedi";

import { ServiceStats } from "models/stats";
import { UsageStats } from '../util/stats'
import { ImagesCache } from "../services/cache";

@Service()
export class StatisticsController {
  private usageStats: UsageStats = UsageStats.getInstance();
  private cache: ImagesCache;

  constructor(imagesCache: ImagesCache) {
    this.cache = imagesCache;
  }

  public async getStats(req: any, res: any): Promise<void> {
    let stats: ServiceStats = {
      hits_vs_Misses: `${this.usageStats.hits}/${this.usageStats.misses}`,
      originalImagesNo: this.usageStats.originalImagesNo(),
      resizedImagesNo: this.usageStats.resizedImagesNo
    };
    //this.cache.performCacheCleanup();
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify(stats));
  }
}