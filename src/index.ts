import 'normalize.css';
import Phaser from 'phaser';
import { World } from './scenes/World';

const game = new Phaser.Game({
  height: 768,
  scene: [World],
  type: Phaser.AUTO,
  width: 1024,
});
