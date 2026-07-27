export type OicOutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';

export type OicAspectRatioPreset = '1:1' | '4:3' | '16:9' | 'free';

export interface OicCropperOptions {
  aspectRatio?: OicAspectRatioPreset;
  outputFormat?: OicOutputFormat;
  outputQuality?: number;
  maintainAspectRatio?: boolean;
  minCropWidth?: number;
  minCropHeight?: number;
  outputWidth?: number;
  outputHeight?: number;
  zoomStep?: number;
  rotateStep?: number;
  rotationMin?: number;
  rotationMax?: number;
  constrainToImage?: boolean;
}

export interface OicCropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OicCropperResult {
  dataUrl: string;
  blob: Blob | null;
  width: number;
  height: number;
  format: OicOutputFormat;
}
