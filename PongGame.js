import { Ball } from "./Ball.js";
import { CollisionDetection } from "./CollisionDetection.js";
import { Score } from "./Score.js";
import { Colors } from "./Colors.js";
import { InfoBox } from "./InfoBox.js";

export class PongGame {
  constructor(width, height, dataCollector) {
    this.collisionDetection = new CollisionDetection();
    this.width = width;
    this.height = height;
    this.topEdge = [this.width, 1000, (-1 * this.width) / 2, this.height / 2];
    this.bottomEdge = [
      this.width,
      1000,
      (-1 * this.width) / 2,
      (-1 * this.height) / 2 - 1000,
    ];
    this.leftEdge = [
      1000,
      this.height,
      (-1 * this.width) / 2 - 1000,
      (-1 * this.height) / 2,
    ];
    this.rightEdge = [
      1000,
      this.height,
      this.width / 2,
      (-1 * this.height) / 2,
    ];
    this.score = new Score(3);
    this.infoBox = new InfoBox();
    this.learningData = [];
    this.ball = new Ball(5, 5, 0, 0, 5);
    this.dataCollector = dataCollector;
  }

  reset() {
    this.ball.reset(5, 5, 0, 0);
  }

  getBall() {
    return this.ball;
  }

  setPlayerOne(player) {
    this.playerOne = player;
  }

  setPlayerTwo(player) {
    this.playerTwo = player;
  }

  handleCollision() {
    if (this.collisionDetection.collides(this.topEdge, this.ball.getBox())) {
      this.ball.bounceTop();
    } else if (
      this.collisionDetection.collides(this.bottomEdge, this.ball.getBox())
    ) {
      this.ball.bounceBottom();
    } else if (
      this.collisionDetection.collides(this.leftEdge, this.ball.getBox())
    ) {
      this.score.givePlayer2Point();
      this.reset();
    } else if (
      this.collisionDetection.collides(this.rightEdge, this.ball.getBox())
    ) {
      this.score.givePlayer1Point();
      this.reset();
    } else if (
      this.collisionDetection.collides(
        this.playerOne.getBox(),
        this.ball.getBox()
      )
    ) {
      this.ball.bounceLeft();
    } else if (
      this.collisionDetection.collides(
        this.playerTwo.getBox(),
        this.ball.getBox()
      )
    ) {
      this.ball.bounceRight();
    }
  }

  update() {
    this.handleCollision();
    if (this.score.hasSomeoneWon()) {
      this.reset();
    } else {
      this.playerOne.update(1);
      this.playerTwo.update(1);
      if (this.score.onlyOnePointLeft()) {
        this.ball.activateDiscoMode();
      }
      this.ball.move();
    }
  }

  render(gl, ctx, textures, textureBuffer, lagFix) {
    this.score.render(gl, ctx, textures, textureBuffer);
    if (this.score.hasSomeoneWon()) {
      const winnerTexture = textures[this.score.getWinnerTextureName()];
      this.infoBox.render(gl, ctx, textureBuffer, winnerTexture);
    } else {
      this.playerOne.render(gl, ctx, textures, textureBuffer, lagFix);
      this.playerTwo.render(gl, ctx, textures, textureBuffer, lagFix);
      this.ball.render(gl, ctx, textures, textureBuffer, lagFix);
      this.drawMiddleLine(gl, ctx, textures, textureBuffer);
    }
  }

  drawMiddleLine(gl, ctx, textures, textureBuffer) {
    const modelMat = mat3.create();
    mat3.translate(modelMat, modelMat, [0, 0]);
    mat3.scale(modelMat, modelMat, [2, 300]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

    gl.uniform4fv(ctx.uColorId, new Float32Array(Colors.BLUE));
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures["none"]);
    gl.uniform1i(ctx.uSampler2DId, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoord);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}
