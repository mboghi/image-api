export type CachedImage = {
  path: string;
  isOriginal: boolean;
  hits: number;
  newHits: number;
}

export type ServiceStats = {
  hits_vs_Misses: string;
  resizedImagesNo: number;
  originalImagesNo: number;
}