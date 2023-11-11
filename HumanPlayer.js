// Represents a human player, controllable by the keyboard.
export class HumanPlayer {
  constructor(paddle, dataCollector, ball) {
    this.pressed = {};
    this.key = {
      LEFT: "ArrowLeft",
      UP: "ArrowUp",
      RIGHT: "ArrowRight",
      DOWN: "ArrowDown",
      A: "KeyA",
      W: "KeyW",
      D: "KeyD",
      S: "KeyS",
    };
    this.paddle = paddle;
    this.dataCollector = dataCollector;
    this.ball = ball;
  }

  getBox() {
    return this.paddle.getBox();
  }

  update(lagFix) {
    if (this.movingDown()) {
      if (!this.paddle.hasReachedBottom()) {
        this.paddle.moveDown(lagFix);
      }
    }
    if (this.movingUp()) {
      if (!this.paddle.hasReachedTop()) {
        this.paddle.moveUp(lagFix);
      }
    }
  }

  render(gl, ctx, textures, textureBuffer, lagFix) {
    this.update(lagFix);
    this.paddle.render(gl, ctx, textures, textureBuffer, lagFix);
  }

  recordTrainingData() {
    let action = [1, 0, 0];
    if (this.movingUp()) {
      action = [0, 1, 0];
    } else if (this.movingDown()) {
      action = [0, 0, 1];
    }
    const entry = [
      (this.ball.getPosition()[0] + 400) / 800,
      (this.ball.getPosition()[1] + 300) / 600,
      this.ball.getVelocity()[0],
      this.ball.getVelocity()[1],
      (this.paddle.getPosition()[1] + 300) / 600,
      action,
    ];
    this.dataCollector.add(entry);
  }

  hookupEventListeners() {
    window.addEventListener("keydown", this.onKeydown, false);
    window.addEventListener("keyup", this.onKeyup, false);
  }

  isDown = (keyCode) => {
    return this.pressed[keyCode] !== undefined && this.pressed[keyCode];
  };

  getPosition() {
    return this.paddle.getPosition();
  }

  onKeydown = (event) => {
    this.pressed[event.code] = true;
  };

  movingDown() {
    return this.isDown(this.key.S) || this.isDown(this.key.DOWN);
  }

  movingUp() {
    return this.isDown(this.key.W) || this.isDown(this.key.UP);
  }

  onKeyup = (event) => {
    this.pressed[event.code] = false;
  };
}
