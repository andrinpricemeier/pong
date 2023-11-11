// Used to draw info messages in the middle of the screen.
export class InfoBox {
  render(gl, ctx, textureBuffer, texture) {
    const modelMat = mat3.create();
    mat3.translate(modelMat, modelMat, [0, 0]);
    mat3.scale(modelMat, modelMat, [100, 100]);

    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

    gl.uniform4fv(ctx.uColorId, new Float32Array([1, 1, 1, 1]));
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(ctx.uSampler2DId, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoord);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}
