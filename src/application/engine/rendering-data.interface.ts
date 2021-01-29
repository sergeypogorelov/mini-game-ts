export interface RenderingData {
  /**
   * tag of an image or sprite
   */
  imageTag: string;

  /**
   * X coordinate on the context of the image to draw
   */
  x: number;

  /**
   * Y coordinate on the context of the image to draw
   */
  y: number;

  /**
   * Width in pixels of the image to draw
   */
  width: number;

  /**
   * Height in pixels of the image to draw
   */
  height: number;
}
