import type { GameObjects } from 'phaser';
import Phaser from 'phaser';
import { Agent } from '../ai/Agent';
import { AGENT_NAMES } from '../constants/AGENT_NAMES';
import { IMAGE_NAMES } from '../constants/IMAGE_NAMES';
import { KEY_PATH_PAIRS } from '../constants/KEY_PATH_PAIRS';
import { TEXT_NAMES } from '../constants/TEXT_NAMES';
import { storedQuantities } from '../data/storedQuantities';
import { startingActions } from '../starting/startingActions';
import { startingFacts } from '../starting/startingFacts';
import { startingGoals } from '../starting/startingGoals';
import { startingPositions } from '../starting/startingPositions';
import type { AgentName } from '../typings/AgentName';
import type { ImageName } from '../typings/ImageName';
import type { Table } from '../typings/Table';
import type { TextName } from '../typings/TextName';
import { createGrid } from '../utils/createGrid';

export class World extends Phaser.Scene {
  private readonly agents = {} as Table<AgentName, Agent>;

  private readonly texts = {} as Table<TextName, GameObjects.Text>;

  private readonly images = {} as Table<ImageName, GameObjects.Image>;

  private readonly planningCooldownInMs = 1000;

  constructor() {
    super(new.target.name.toLowerCase());
  }

  preload(this: this): void {
    for (const [key, path] of KEY_PATH_PAIRS) {
      this.load.image(key, path);
    }
  }

  create(this: this): void {
    this.spawnGrass();
    this.spawnImages();
    this.spawnAgents();
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

  private spawnAgents(this: this): void {
    for (const name of AGENT_NAMES) {
      this.agents[name] = new Agent({
        derivedActions: startingActions[name],
        image: this.images[name],
        initialGoal: startingGoals[name],
        initialState: startingFacts[name],
        name,
      });
    }
  }

  private spawnText(this: this): void {
    let y = -15;

    for (const name of TEXT_NAMES) {
      this.texts[name] = this.add.text(5, (y += 20), `${name}: ${storedQuantities.ore}`, {
        font: '14pt Helvetica',
      });
    }
  }
}
