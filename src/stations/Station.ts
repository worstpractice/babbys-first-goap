import type { GameObjects } from 'phaser';
import type { StationName } from 'src/typings/names/StationName';
import type { Position } from 'src/typings/Position';
import type { Facts } from 'src/typings/tables/Facts';

export type StationProps = {
  readonly image: GameObjects.Image;
  readonly initialFacts: Facts;
  readonly name: StationName;
  readonly position: Position;
};

export class Station {
  readonly image: GameObjects.Image;

  readonly facts: Facts;

  readonly name: StationName;

  readonly position: Position;

  constructor({ image, initialFacts, name, position }: StationProps) {
    this.image = image;
    this.facts = initialFacts;
    this.name = name;
    this.position = position;
    console.log(this);
  }
}
