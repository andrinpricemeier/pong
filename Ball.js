import { Colors } from "./Colors.js";

export class Ball {
  constructor(width, height, positionX, positionY, speed) {
    this.width = width;
    this.height = height;
    this.positionX = positionX;
    this.positionY = positionY;
    console.log(speed);
    this.speed = speed;
    this.velocity = this.getValidVelocity();
    this.color = Colors.GRAY;
    this.discoModeActive = false;
  }

  isMovingRight() {
    return this.velocity[0] > 0;
  }

  reset(width, height, positionX, positionY) {
    this.width = width;
    this.height = height;
    this.positionX = positionX;
    this.positionY = positionY;
    this.velocity = this.getValidVelocity();
  }

  getVelocity() {
    return this.velocity;
  }

  getValidVelocity() {
    let degrees = this.getRandomInt(20, 60);
    const quadrant = this.getRandomInt(0, 1000);
    const quadrantNum = Math.floor(quadrant / 250);
    degrees = degrees + 90 * quadrantNum;
    return [Math.cos(degrees * (Math.PI/180)), Math.sin(degrees * (Math.PI/180)), this.speed];
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getBox() {
    return [
      this.width * 2,
      this.height * 2,
      this.positionX - this.width,
      this.positionY - this.height,
    ];
  }

  bounceTop() {
    this.velocity[1] *= -1;
  }

  bounceBottom() {
    this.velocity[1] *= -1;
  }

  bounceLeft() {
    this.velocity[0] *= -1;
  }

  bounceRight() {
    this.velocity[0] *= -1;
  }

  move() {
    this.positionX += this.velocity[0] * this.velocity[2];
    if (this.positionX < -400) {
      this.positionX = -400;
    } else if (this.positionX > 400) {
      this.positionX = 400;
    }
    this.positionY += this.velocity[1] * this.velocity[2];
    if (this.positionY > 300) {
      this.positionY = 300;
    } else if (this.positionY < -300) {
      this.positionY = -300;
    }
  }

  activateDiscoMode() {
    this.discoModeActive = true;
  }

  getColor() {
    if (this.discoModeActive) {
      return [
        this.getRandomInt(-50, 50) / 50,
        this.getRandomInt(-50, 50) / 50,
        this.getRandomInt(-50, 50) / 50,
        1,
      ];
    } else {
      return this.color;
    }
  }

  getPosition() {
    return [this.positionX, this.positionY];
  }

  render(gl, ctx, textures, textureBuffer, lagFix) {
    this.positionX += this.velocity[0] * this.velocity[2] * lagFix;
    this.positionY += this.velocity[1] * this.velocity[2] * lagFix;

    const modelMat = mat3.create();
    mat3.translate(modelMat, modelMat, [this.positionX, this.positionY]);
    mat3.scale(modelMat, modelMat, [this.width, this.height]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

    // Use the pseudo texture to set some color ourselves.
    gl.uniform4fv(ctx.uColorId, new Float32Array(this.getColor()));
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures["none"]);
    gl.uniform1i(ctx.uSampler2DId, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoord);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}
