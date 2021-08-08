import 'normalize.css';
import Phaser from 'phaser';
import { DemoScene } from './scenes/DemoScene';

const game = new Phaser.Game({
  height: 768,
  scene: DemoScene,
  type: Phaser.AUTO,
  width: 1024,
});
