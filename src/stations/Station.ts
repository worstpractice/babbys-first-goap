import type { GameObjects } from 'phaser';
import type { ResourceName } from 'src/typings/names/ResourceName';
import type { StationName } from 'src/typings/names/StationName';
import type { Position } from 'src/typings/Position';
export type StationProps = {
  readonly image: GameObjects.Image;
  readonly name: StationName;
  readonly position: Position;
};

export class Station {
  readonly image: GameObjects.Image;

  readonly facts: Set<ResourceName> = new Set<ResourceName>();

  readonly name: StationName;

  readonly position: Position;

  constructor({ image, name, position }: StationProps) {
    this.image = image;
    this.name = name;
    this.position = position;
    console.log(this);
  }
}
