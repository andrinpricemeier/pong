//
// DI Computer Graphics
//
// WebGL Exercises
//
import { PongGame } from "./PongGame.js";
import { HumanPlayer } from "./HumanPlayer.js";
import { Paddle } from "./Paddle.js";
import { UpDownAIPlayer } from "./UpDownAIPlayer.js";
import { PredictiveAIPlayer } from "./PredictiveAIPlayer.js";
import { Colors } from "./Colors.js";
import { DataCollector } from "./DataCollector.js";

const dataCollector = new DataCollector();
const pong = new PongGame(800, 600, dataCollector);
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
  shaderProgram: -1,
  aVertexPositionId: -1,
  uColorId: -1,
  uProjectionMatId: -1,
  uModelMatId: -1,
  aVertexTextureCoord: -1,
  uSampler2DId: -1,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
  buffer: -1,
  textureBuffer: -1,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
  "use strict";
  var canvas = document.getElementById("myCanvas");
  gl = createGLContext(canvas);
  initGL();
  loadTextures();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
  "use strict";
  ctx.shaderProgram = loadAndCompileShaders(
    gl,
    "VertexShader.glsl",
    "FragmentShader.glsl"
  );
  setUpAttributesAndUniforms();
  setUpBuffers();

  gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
  "use strict";
  ctx.aVertexPositionId = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexPosition"
  );
  ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
  ctx.uProjectionMatId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uProjectionMat"
  );
  ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
  ctx.aVertexTextureCoord = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexTextureCoord"
  );
  ctx.uSampler2DId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
  "use strict";
  rectangleObject.buffer = gl.createBuffer();
  var vertices = [-1, -1, 1, -1, 1, 1, -1, 1];
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  rectangleObject.textureBuffer = gl.createBuffer();
  var textureCoord = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoord),
    gl.STATIC_DRAW
  );
}

/**
 * Draw the scene.
 */
function render(lagFix) {
  "use strict";
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
  gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(ctx.aVertexPositionId);

  var projectionMat = mat3.create();
  mat3.fromScaling(projectionMat, [
    2.0 / gl.drawingBufferWidth,
    2.0 / gl.drawingBufferHeight,
  ]);
  gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);
  pong.render(gl, ctx, textures, rectangleObject.textureBuffer, lagFix);
}

function update() {
  pong.update();
}

const MS_PER_UPDATE = 20;
let previous = 0;
let lag = 0.0;
function drawAnimated(current) {
  const elapsed = current - previous;
  previous = current;
  lag += elapsed;
  while (lag >= MS_PER_UPDATE) {
    update();
    lag -= MS_PER_UPDATE;
  }
  render(lag / MS_PER_UPDATE);
  window.requestAnimationFrame(drawAnimated);
}

var textures = {};

function initTexture(image, textureObject) {
  gl.bindTexture(gl.TEXTURE_2D, textureObject);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  // turn texture off again
  gl.bindTexture(gl.TEXTURE_2D, null);
}

const images = [
  "textures/score_0.png",
  "textures/score_1.png",
  "textures/score_2.png",
  "textures/score_3.png",
  "textures/player_1_wins.png",
  "textures/player_2_wins.png",
];
let imagesLoaded = 0;
function loadTextures() {
  // Add a pseudo one pixel texture so that we can choose between using a color and textures at will.
  textures["none"] = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textures["none"]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255, 255])
  );
  gl.bindTexture(gl.TEXTURE_2D, null);
  for (const imageFilepath of images) {
    const image = new Image();
    image.onload = function () {
      imagesLoaded++;
      textures[imageFilepath] = gl.createTexture();
      initTexture(image, textures[imageFilepath]);
      if (images.length === imagesLoaded) {
        const playerOne = new HumanPlayer(
          new Paddle(5, 50, -380, 0, 600, Colors.RED, 5),
          dataCollector,
          pong.getBall()
        );
        playerOne.hookupEventListeners();

        /*const playerOne = new PredictiveAIPlayer(
          new Paddle(5, 50, -380, 0, 600, Colors.NEON, 25),
          pong.getBall(),
          800,
          600,
          "model/tfjs_graph_model/model.json",
          false
        );*/
        /*const playerTwo = new UpDownAIPlayer(
          new Paddle(5, 85, 380, 0, 600, Colors.NEON, 25)
        );*/
        const playerTwo = new PredictiveAIPlayer(
          new Paddle(5, 50, 380, 0, 600, Colors.NEON, 5),
          pong.getBall(),
          800,
          600,
          "model/tfjs_graph_model/model.json",
          true
        );
        pong.setPlayerOne(playerOne);
        pong.setPlayerTwo(playerTwo);
        window.requestAnimationFrame(drawAnimated);
      }
    };
    image.src = imageFilepath;
  }
}
