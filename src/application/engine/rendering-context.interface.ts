import { RenderingData } from './rendering-data.interface';

export interface RenderingContext {
  /**
   * Width of the context in pixels
   */
  width: number;

  /**
   * Height of the context in pixels
   */
  height: number;

  /**
   * Draws an entity according to the specified data
   * @param data data about rendering
   */
  draw(data: RenderingData): void;
}
