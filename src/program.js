export class Program {

  constructor(gl, vertexSource, fragmentSource, uniforms) {
    this.vertexShader = vertexSource;
    this.fragmentShader = fragmentSource;
    this.uniforms = uniforms;
  }

}
