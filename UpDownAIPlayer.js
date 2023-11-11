export class UpDownAIPlayer {
  constructor(paddle) {
    this.paddle = paddle;
    this.movingUp = true;
  }

  getBox() {
    return this.paddle.getBox();
  }

  update(lagFix) {
    if (this.movingUp) {
      if (!this.paddle.hasReachedTop()) {
        this.paddle.moveUp(lagFix);
      } else {
        this.movingUp = false;
        this.paddle.moveDown(lagFix);
      }
    } else {
      if (!this.paddle.hasReachedBottom()) {
        this.paddle.moveDown(lagFix);
      } else {
        this.movingUp = true;
        this.paddle.moveUp(lagFix);
      }
    }
  }

  render(gl, ctx, textures, textureBuffer, lagFix) {
    this.update(lagFix);
    this.paddle.render(gl, ctx, textures, textureBuffer, lagFix);
  }
}
