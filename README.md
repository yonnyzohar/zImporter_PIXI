# zImporter

The `zImporter` is a TypeScript package designed to import and manage graphical hierarchies created in **zStudio**. This package allows seamless integration of assets and scenes built in **zStudio** into your JavaScript or TypeScript-based projects, particularly those using **PixiJS**.

## Features
- Import and manage scenes and graphical hierarchies from **zStudio**.
- Works with **PixiJS** to display and interact with imported assets.
- Provides a flexible and easy-to-use API for handling assets and scenes.

## Installation

To install the `zImporter` package, you can add it to your project using npm (or yarn) from the npm registry.
eg (npm i git@github.com:yonnyzohar/zImporter_PIXI.git)

You need to be using "module": "Node16", "moduleResolution": "node16", in your tsconfig.json

## Usage
Importing the zImporter into Your Project
To start using zImporter, you need to import the necessary modules into your project.

```typescript
import { GameScene, GameContainer } from 'zImporter_PIXI';
```

Example Project
Below is an example of how to integrate zImporter into a basic PixiJS project.

Create a New PixiJS Application
```typescript
import * as PIXI from 'pixi.js';
import { GameScene, GameContainer } from 'zImporter_PIXI';

// Initialize the PixiJS application
const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});

document.body.appendChild(app.view);
```
// Example: Loading and displaying a scene from zStudio
```typescript
const gameScene = new GameScene('path/to/your/scene.zstudio'); // Specify your zStudio scene file

gameScene.load().then(() => {
  app.stage.addChild(gameScene);
});
```

Creating and Adding Containers
You can use the GameContainer class to group your assets.
```typescript
const container = new GameContainer();
container.addChild(gameScene);
app.stage.addChild(container);
Handling User Interaction
You can interact with your imported scene just like any other PixiJS object.

gameScene.on('click', () => {
  console.log('Scene clicked!');
});
```

API
The package exposes several classes and methods that allow you to interact with imported assets:

GameScene
A class representing an imported scene from zStudio.

Methods:
load(): Loads the scene and its assets.
addChild(child: PIXI.DisplayObject): Adds a child object to the scene.
GameContainer
A container to hold multiple objects in a hierarchical structure.

Methods:
addChild(child: PIXI.DisplayObject): Adds a child object to the container.
Example Files
You can refer to the example project in the examples directory for a more comprehensive demo on how to use zImporter.

## Contributing
If you'd like to contribute to the development of zImporter, feel free to fork the repository, create a branch, and submit a pull request. Please make sure to follow the existing code style and add tests where applicable.

## License
This project is licensed under the MIT License - see the LICENSE file for details.




