import { Entity } from '../engine/entity.class';
import { Size } from '../engine/size.class';

export class TestEntity extends Entity {
  public constructor() {
    super(null, new Size(250, 125));
  }
}
