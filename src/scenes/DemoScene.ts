import type { GameObjects } from 'phaser';
import Phaser from 'phaser';
import { Agent } from '../ai/Agent';
import { AGENT_NAMES } from '../constants/AGENT_NAMES';
import { KEY_PATH_PAIRS } from '../constants/KEY_PATH_PAIRS';
import { SPRITE_NAMES } from '../constants/SPRITE_NAMES';
import { TEXT_NAMES } from '../constants/TEXT_NAMES';
import { storedQuantities } from '../data/storedQuantities';
import { startingActions } from '../starting/startingActions';
import { startingFacts } from '../starting/startingFacts';
import { startingGoals } from '../starting/startingGoals';
import { startingPositions } from '../starting/startingPositions';
import type { AgentName } from '../typings/AgentName';
import type { SpriteName } from '../typings/SpriteName';
import type { Table } from '../typings/Table';
import type { TextName } from '../typings/TextName';
import { createGrid } from '../utils/createGrid';

export class DemoScene extends Phaser.Scene {
  readonly agents = {} as Table<AgentName, Agent>;

  readonly texts = {} as Table<TextName, GameObjects.Text>;

  readonly sprites = {} as Table<SpriteName, GameObjects.Sprite>;

  constructor() {
    super({
      active: true,
      key: new.target.name.toLowerCase(),
      physics: {
        default: 'arcade',
      },
      visible: true,
    });
  }

  preload(this: this): void {
    for (const [key, path] of KEY_PATH_PAIRS) {
      this.load.image(key, path);
    }
  }

  create(this: this): void {
    this.#spawnGrass();
    this.#spawnSprites();
    this.#spawnAgents();
    this.#spawnText();
  }

  update(this: this): void {
    this.#updateAgents();
    this.#updateTexts();
  }

  #updateAgents(this: this): void {
    for (const name of AGENT_NAMES) {
      this.agents[name].update();
    }
  }

  #updateTexts(this: this): void {
    for (const name of TEXT_NAMES) {
      this.texts[name].setText(`${name}: ${storedQuantities[name]}`);
    }
  }

  #spawnGrass(this: this): void {
    for (const [x, y] of createGrid(20, 15)) {
      this.add.sprite(x, y, 'grass');
    }
  }

  #spawnSprites(this: this): void {
    for (const name of SPRITE_NAMES) {
      const { x, y } = startingPositions[name];

      this.sprites[name] = this.add.sprite(x, y, name);
    }
  }

  #spawnAgents(this: this): void {
    for (const name of AGENT_NAMES) {
      this.agents[name] = new Agent({
        derivedActions: startingActions[name],
        initialGoal: startingGoals[name],
        initialState: startingFacts[name],
        name,
        sprite: this.sprites[name],
      });
    }
  }

  #spawnText(this: this): void {
    let y = -15;

    for (const name of TEXT_NAMES) {
      this.texts[name] = this.add.text(5, (y += 20), `${name}: ${storedQuantities.ore}`, {
        font: '14pt Helvetica',
      });
    }
  }
}
