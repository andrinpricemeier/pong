export class PredictiveAIPlayer {
  constructor(paddle, ball, gameWidth, gameHeight, modelPath, isOnTheRight) {
    this.paddle = paddle;
    tf.loadLayersModel(modelPath).then((model) => {
      this.model = model;
    });
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.ball = ball;
    this.isOnTheRight = isOnTheRight;
  }

  getBox() {
    return this.paddle.getBox();
  }

  update(lagFix) {    
    // Since we do nothing most of the time when the ball is flying towards the enemy, we skip predicting those positions.
    const ballIsTowardsUs =  (this.isOnTheRight && this.ball.getVelocity()[0] > 0 || !this.isOnTheRight && this.ball.getVelocity()[0] < 0);
    if (this.model !== undefined && ballIsTowardsUs) {
      let ballX =
        (this.ball.getPosition()[0] + this.gameWidth / 2) / this.gameWidth;
      if (this.isOnTheRight) {
        ballX = 1 - ballX;
      }
      const ballY =
        (this.ball.getPosition()[1] + this.gameHeight / 2) / this.gameHeight;
      const paddleY =
        (this.paddle.getPosition()[1] + this.gameHeight / 2) / this.gameHeight;
      let ballDirectionX = this.ball.getVelocity()[0];
      if (this.isOnTheRight) {
        ballDirectionX *= -1;
      }
      const ballDirectionY = this.ball.getVelocity()[1];
      const actions = this.model
        .predict(
          tf.tensor([[ballX, ballY, ballDirectionX, ballDirectionY, paddleY]])
        )
        .arraySync()[0];
      if (actions[1] >= actions[0] && actions[1] >= actions[2]) {
        if (!this.paddle.hasReachedTop()) {
          this.paddle.moveUp(lagFix);
        }
      } else if (actions[2] >= actions[0] && actions[2] >= actions[1]) {
        if (!this.paddle.hasReachedBottom()) {
          this.paddle.moveDown(lagFix);
        }
      }
    }
  }

  render(gl, ctx, textures, textureBuffer, lagFix) {
    this.update(lagFix);
    this.paddle.render(gl, ctx, textures, textureBuffer, lagFix);
  }
}
