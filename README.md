# zImporter

The `zImporter` is a TypeScript package designed to import and manage graphical hierarchies created in **zStudio**. This package allows seamless integration of assets and scenes built in **zStudio** into your JavaScript or TypeScript-based projects, particularly those using **PixiJS**.

## Features

* Import and manage scenes and graphical hierarchies from **zStudio**
* Works with **PixiJS** to display and interact with imported assets
* Provides a flexible and easy-to-use API for handling assets and scenes

## Installation

To install the `zImporter` package from the npm registry:

```bash
npm install zimporter-pixi@1.0.10
```

Or to always get the latest version:

```bash
npm install zimporter-pixi@latest
```

> **Note:** Your `tsconfig.json` should include:

```json
"module": "ESNext",
"moduleResolution": "bundler"
```

## Building
npm run package

## Usage

### Importing zImporter into Your Project

You can find an example project here:
[https://github.com/yonnyzohar/zImporter\_PIXI\_Example](https://github.com/yonnyzohar/zImporter_PIXI_Example)

Basic import:

```ts
import { ZTimeline } from 'zimporter-pixi';
```

### Example: Creating a New PixiJS Application

```ts
import * as PIXI from 'pixi.js';
import { Game } from './Game';
import { ZSceneStack, ZUpdatables } from 'zimporter-pixi';

const app = new PIXI.Application({
  backgroundColor: 0x000000,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  antialias: true,
});

function resizeCanvas() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  ZSceneStack.resize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resizeCanvas);

const game = new Game(app.stage, resizeCanvas);
document.body.appendChild(app.view as any);
ZUpdatables.init(24);

let lastTime = performance.now();
let frameCount = 0;

app.ticker.add(() => {
  frameCount++;
  const now = performance.now();
  const delta = now - lastTime;

  if (delta >= 1000) {
    frameCount = 0;
    lastTime = now;
  }

  const deltaMS = PIXI.Ticker.shared.deltaMS / 1000;
  game.update(deltaMS);
  ZUpdatables.update();
});
```

> This sets up a Pixi renderer and integrates zImporter’s update system.

### Example: Loading and Displaying a Scene from zStudio

```ts
import * as PIXI from 'pixi.js';
import { ZScene, ZSceneStack, ZTimeline } from 'zimporter-pixi';

let scene = new ZScene();
scene.load('./assets/robo/', () => {
  ZSceneStack.push(scene);
  const mc = ZSceneStack.spawn('RobotWalker') as ZTimeline;
  mc.play();
  stage.addChild(mc);
  mc.x = 100;
  mc.y = 200;
});
```

### Example: Loading a Stage Created in zStudio

```ts
import * as PIXI from 'pixi.js';
import { ZScene, ZSceneStack } from 'zimporter-pixi';

constructor(stage: PIXI.Container) {
  this.stage = stage;
  const loadPath = (window as any).loadPath;
  const scene = new ZScene('testScene');
  scene.load(loadPath, () => {
    ZSceneStack.push(scene);
    scene.loadStage(this.stage);
  });
}
```

> Each `ZScene` has a stage associated with it. This preserves the position and orientation logic defined in **zStudio**. Always add the scene stage to the root container.

## API

The package exposes several classes and methods for interacting with imported assets:

### `ZScene`

* Container for your entire scene.
* Handles screen resizing.
* Allows spawning of assets or loading full stages.

### `ZContainer`

* Core class for all visual elements.
* Extends `PIXI.Container` and adds:

  * Anchoring support
  * Orientation data from zStudio
* Set `.resizeable = false` to disable responsive behavior.

#### `Working with Text`
  In ZStudio, texts are always wrapper in a container, and are called "label" by default.
  If you know a specific container holds a text fields, you can acces it via:
  `getTextField():PIXI.Text | null`
  You can also set a string on the text via the container using:
  `setText(text:string):void`

### `ZButton`

* Extends `ZContainer`.
* Has `.enable()` / `.disable()` methods.
* Supports child containers with special names:

  * `upState`, `downState`, `overState`, `disabledState`, `labelContainer`

> When these are defined in **zStudio**, the button works automatically.

### `ZTimeline`

* Extends `ZContainer`.
* Manages frame-based timeline animations.
* API includes:

  * `.play()`, `.stop()`
  * `.gotoAndPlay(frameNum)`, `.gotoAndStop(frameNum)`
  * `.addStateEndEventListener(cb)`, `.removeStateEndEventListener(cb)`

### `ZState`

* Extends `ZContainer`.
* Only one child is visible at a time.
* Use `.setState(name: string)` to switch visible content.
* Can contain nested `ZTimeline` objects.

## Contributing

We welcome contributions!
To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request.

Please follow the existing code style and add tests where relevant.

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
