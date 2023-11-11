import { Colors } from "./Colors.js";
export class Score {
  constructor(maxScore) {
    this.player1 = 0;
    this.player2 = 0;
    this.maxScore = maxScore;
  }

  givePlayer1Point() {
    this.player1++;
  }

  givePlayer2Point() {
    this.player2++;
  }

  hasSomeoneWon() {
    return this.player1 >= this.maxScore || this.player2 >= this.maxScore;
  }

  getWinner() {
    if (this.player1 >= this.maxScore) {
      return 1;
    } else {
      return 2;
    }
  }

  getWinnerTextureName() {
    if (this.player1 >= this.maxScore) {
      return "textures/player_1_wins.png";
    } else {
      return "textures/player_2_wins.png";
    }
  }

  onlyOnePointLeft() {
    return (
      this.player1 == this.maxScore - 1 || this.player2 == this.maxScore - 1
    );
  }

  render(gl, ctx, textures, textureBuffer) {
    this.drawPlayer1(gl, ctx, textures, textureBuffer);
    this.drawPlayer2(gl, ctx, textures, textureBuffer);
  }

  drawPlayerWon(gl, ctx, textures, textureBuffer, playerNumber) {
    const modelMat = mat3.create();
    mat3.translate(modelMat, modelMat, [0, 0]);
    mat3.scale(modelMat, modelMat, [100, 100]);

    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

    gl.uniform4fv(ctx.uColorId, new Float32Array([1, 1, 1, 1]));
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(
      gl.TEXTURE_2D,
      textures["textures/player_" + playerNumber + "_wins.png"]
    );
    gl.uniform1i(ctx.uSampler2DId, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoord);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  drawPlayer1(gl, ctx, textures, textureBuffer) {
    const modelMat = mat3.create();
    mat3.translate(modelMat, modelMat, [-100, 220]);
    mat3.scale(modelMat, modelMat, [50, 50]);

    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

    gl.uniform4fv(ctx.uColorId, new Float32Array([1, 1, 1, 1]));
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.getScoreTexture(textures, this.player1));
    gl.uniform1i(ctx.uSampler2DId, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoord);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  drawPlayer2(gl, ctx, textures, textureBuffer) {
    const modelMat = mat3.create();
    mat3.translate(modelMat, modelMat, [100, 220]);
    mat3.scale(modelMat, modelMat, [50, 50]);

    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

    gl.uniform4fv(ctx.uColorId, new Float32Array([1, 1, 1, 1]));
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.getScoreTexture(textures, this.player2));
    gl.uniform1i(ctx.uSampler2DId, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoord);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  getScoreTexture(textures, score) {
    return textures["textures/score_" + score + ".png"];
  }
}
