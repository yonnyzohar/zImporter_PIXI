# zImporter

The `zImporter` is a TypeScript package designed to import and manage graphical hierarchies created in **zStudio**. This package allows seamless integration of assets and scenes built in **zStudio** into your JavaScript or TypeScript-based projects, particularly those using **PixiJS**.

## Features
- Import and manage scenes and graphical hierarchies from **zStudio**.
- Works with **PixiJS** to display and interact with imported assets.
- Provides a flexible and easy-to-use API for handling assets and scenes.

## Installation

To install the `zImporter` package, you can add it to your project using npm (or yarn) from the npm registry.
eg:

npm install zimporter-pixi@1.0.10

or just get latest:
npm install zimporter-pixi@latest

You need to be using "module": "ESNext", "moduleResolution": "bundler", in your tsconfig.json

## Usage
Importing the zImporter into Your Project
To start using zImporter, you need to import the necessary modules into your project.

See example project here:
https://github.com/yonnyzohar/zImporter_PIXI_Example

```typescript
import { ZTimeline } from 'zimporter-pixi';
```

Example Project
Below is an example of how to integrate zImporter into a basic PixiJS project.

Create a New PixiJS Application
```typescript
import * as PIXI from 'pixi.js';

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
import * as PIXI from 'pixi.js';
import { ZScene } from "zimporter-pixi";
import { ZSceneStack } from "zimporter-pixi";
import { ZTimeline } from "zimporter-pixi";

let scene:ZScene = new ZScene();
        scene.load("./assets/robo/",()=>{
            ZSceneStack.push(scene);
            let mc = ZSceneStack.spawn("RobotWalker") as ZTimeline;
            mc.play();
            stage.addChild(mc);
            mc.x = 100;
            mc.y = 200;
            
        })
```

## API
The package exposes several classes and methods that allow you to interact with imported assets:

ZScene:
Everything sits inside a scene. 

ZContainer:
This is the core class

ZButton:
ZTimeline:
ZState:


## Contributing
If you'd like to contribute to the development of zImporter, feel free to fork the repository, create a branch, and submit a pull request. Please make sure to follow the existing code style and add tests where applicable.

## License
This project is licensed under the MIT License - see the LICENSE file for details.




