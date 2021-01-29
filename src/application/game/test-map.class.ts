import { Map } from '../engine/map.class';
import { Size } from '../engine/size.class';
import { TestEntity } from './test-entity.class';

export class TestMap extends Map {
  public constructor() {
    super(new Size(1000, 500));

    this.initEntities();
  }

  private initEntities(): void {
    const testEntity = new TestEntity();

    this.entities.push(testEntity);
  }
}
