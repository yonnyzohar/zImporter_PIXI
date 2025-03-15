import * as PIXI from 'pixi.js';
import { ZUpdatables } from "zImporter_PIXI/ZUpdatables";
import { Game } from "./Game";

//npx webpack
const app = new PIXI.Application({

  backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1, // Handle high-DPI screens
    autoDensity: true, // Improve sharpness on high-DPI screens
    antialias: true // Smooth rendering
});

function resize(){
  let windowSize: PIXI.Point = getWindowSize();
  let scale: PIXI.Point = getScale(windowSize);
  app.renderer.resize(windowSize.x, windowSize.y);
  app.stage.scale.x = scale.x;
  app.stage.scale.y = scale.y;
}

window.addEventListener("resize", () => {
  resize();
});

function getWindowSize(): PIXI.Point {
  return new PIXI.Point(window.innerWidth, window.innerHeight);
}

function getScale(windowSize: PIXI.Point): PIXI.Point {
  let scale: number;
  if (true) {
      if (windowSize.x > windowSize.y) {
          scale = windowSize.y / 640;
      } else {
          scale = windowSize.x / 1136;
      }
  } else {
      if (windowSize.x > windowSize.y) {
          scale = windowSize.y / 1136;
      } else {
          let yScale = windowSize.y / 640;
          let xScale = windowSize.x / 1136;
          scale = Math.min(xScale, yScale);
      }
  }
  if (scale >= 1 ) {
      scale = 1;
  }
  return new PIXI.Point(scale, scale);
}

(globalThis as any).__PIXI_APP__ = app;

var game = new Game(app.stage);


// Append the app's view to the DOM
document.body.appendChild(app.view as any);
ZUpdatables.init(24);

const fpsText = new PIXI.Text('FPS: 0', { fontSize: 24, fill: 'white' });
fpsText.position.set(10, 10);
app.stage.addChild(fpsText);

// Update FPS every frame
let lastTime = performance.now();
let frameCount = 0;

app.ticker.add(
  ()=>{

    frameCount++;
    const now = performance.now();
    const delta = now - lastTime;
    
    if (delta >= 1000) { // Update every second
        const fps = (frameCount / delta) * 1000;
        fpsText.text = `FPS: ${fps.toFixed(1)}`;
        frameCount = 0;
        lastTime = now;
    }

    const ticker = PIXI.Ticker.shared;
    var deltaMS = ticker.deltaMS / 1000;
    game.update(deltaMS);
    ZUpdatables.update();
  } 
);

resize();