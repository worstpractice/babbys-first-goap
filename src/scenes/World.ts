import type { GameObjects } from 'phaser';
import Phaser from 'phaser';
import { Agent } from 'src/ai/Agent';
import { AGENT_NAMES } from 'src/constants/AGENT_NAMES';
import { IMAGE_NAMES } from 'src/constants/IMAGE_NAMES';
import { PRELOAD_NAMES } from 'src/constants/PRELOAD_NAMES';
import { STATION_NAMES } from 'src/constants/STATION_NAMES';
import { TEXT_NAMES } from 'src/constants/TEXT_NAMES';
import { storedQuantities } from 'src/data/storedQuantities';
import { startingActions } from 'src/starting/startingActions';
import { startingGoals } from 'src/starting/startingGoals';
import { startingPositions } from 'src/starting/startingPositions';
import { Station } from 'src/stations/Station';
import type { AgentName } from 'src/typings/names/AgentName';
import type { ImageName } from 'src/typings/names/ImageName';
import type { StationName } from 'src/typings/names/StationName';
import type { TextName } from 'src/typings/names/TextName';
import type { Table } from 'src/typings/Table';
import { createGrid } from 'src/utils/createGrid';
import { toSnakeCase } from 'src/utils/mapping/toSnakeCase';

export class World extends Phaser.Scene {
  private readonly agents = {} as Table<AgentName, Agent>;

  private readonly texts = {} as Table<TextName, GameObjects.Text>;

  private readonly images = {} as Table<ImageName, GameObjects.Image>;

  private readonly stations = {} as Table<StationName, Station>;

  private readonly planningCooldownInMs = 10_000 as const;

  constructor() {
    super(toSnakeCase(new.target.name));
  }

  preload(this: this): void {
    for (const name of PRELOAD_NAMES) {
      this.load.image({
        key: name,
        url: `../assets/${name}.png` as const,
      });
    }
  }

  create(this: this): void {
    this.spawnGrass();
    this.spawnImages();
    this.spawnAgents();
    this.spawnStations();
    this.spawnText();
    this.spawnPlans();
  }

  update(this: this): void {
    this.updateAgents();
    this.updateTexts();
  }

  private spawnPlans(this: this): void {
    this.replan(); // Kicks off the recursion
  }

  private readonly queueReplan = (): void => {
    window.setTimeout(this.replan, this.planningCooldownInMs);
  };

  private readonly replan = (): void => {
    for (const name of AGENT_NAMES) {
      this.agents[name].makePlan();
    }

    window.setTimeout(this.queueReplan);
  };

  private updateAgents(this: this): void {
    for (const name of AGENT_NAMES) {
      this.agents[name].update();
    }
  }

  private updateTexts(this: this): void {
    for (const name of TEXT_NAMES) {
      this.texts[name].setText(`${name}: ${storedQuantities[name]}`);
    }
  }

  private spawnGrass(this: this): void {
    for (const [x, y] of createGrid(20, 15)) {
      this.add.image(x, y, 'grass');
    }
  }

  private spawnImages(this: this): void {
    for (const name of IMAGE_NAMES) {
      const { x, y } = startingPositions[name];

      this.images[name] = this.add.image(x, y, name);
    }
  }

  private spawnStations(this: this): void {
    for (const name of STATION_NAMES) {
      this.stations[name] = new Station({
        image: this.images[name],
        initialFacts: {
          has_ore: false,
          has_pickaxe: false,
        },
        name,
        position: startingPositions[name],
      });
    }
  }

  private spawnAgents(this: this): void {
    for (const name of AGENT_NAMES) {
      this.agents[name] = new Agent({
        derivedActions: startingActions[name],
        image: this.images[name],
        initialFacts: {
          has_ore: false,
          has_pickaxe: false,
        },
        initialGoal: startingGoals[name],
        name,
      });
    }
  }

  private spawnText(this: this): void {
    let y = -35;

    for (const name of TEXT_NAMES) {
      this.texts[name] = this.add.text(5, (y += 35), `${name}: ${storedQuantities.ore}`, {
        color: 'black',
        fontFamily: 'Arial',
        fontSize: '25pt',
      });
    }
  }
}
