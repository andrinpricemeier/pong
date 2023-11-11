export class Paddle {
  constructor(width, height, positionX, positionY, fieldHeight, color, speed) {
    this.width = width;
    this.height = height;
    this.positionX = positionX;
    this.positionY = positionY;
    this.fieldHeight = fieldHeight;
    this.color = color;
    this.speed = speed;
  }

  getPosition() {
    return [this.positionX, this.positionY];
  }

  getBox() {
    return [
      this.width * 2,
      this.height * 2,
      this.positionX - this.width,
      this.positionY - this.height,
    ];
  }

  render(gl, ctx, textures, textureBuffer, lagFix) {
    const modelMat = mat3.create();
    mat3.translate(modelMat, modelMat, [this.positionX, this.positionY]);
    mat3.scale(modelMat, modelMat, [this.width, this.height]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

    gl.uniform4fv(ctx.uColorId, new Float32Array(this.color));
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures["none"]);
    gl.uniform1i(ctx.uSampler2DId, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoord);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  hasReachedTop() {
    return this.positionY + this.height + this.speed > this.fieldHeight / 2;
  }

  hasReachedBottom() {
    return this.positionY - this.height - this.speed < -(this.fieldHeight / 2);
  }

  moveDown(lagFix) {
    this.positionY -= this.speed * lagFix;
  }

  moveUp(lagFix) {
    this.positionY += this.speed * lagFix;
  }
}
