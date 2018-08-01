import { Cache } from 'utils/cache';
import { compileShader, getFormattedCode, linkProgram } from 'webgl-shader';

export class WebGLContext {

  constructor(options) {
    if (!options.canvas)
      throw new Error(`Renderer.ctor(): ${ERROR.MISSING_CANVAS}`);

    this._gl = options.canvas.getContext(`webgl2`);

    this._verbose = {};
    this._verbose.name = options.name || DEFAULT_NAME;
    this._verbose.logAll = options.verbose || false;

    this._VBOs = new Cache();
    this._VAOs = new Cache();
    this._programs = new Cache();
  }

  compile(program) {
    const vertexShader = compileShader(
      program.vertexSource,
      this._gl.VERTEX_SHADER
    );
    const fragmentShader = compileShader(
      program.vertexSource,
      this._gl.FRAGMENT_SHADER
    );
    const vertexFailed = !(vertexShader instanceof WebGLShader);
    const fragmentFailed = !(fragmentShader instanceof WebGLShader);
    const failed = vertexFailed && fragmentFailed;

    const programData = this._programs.get(program);
    programData.failed = failed;

    if (vertexFailed) {
      const code = getFormattedCode(program.vertexSource);
      console.warn(`vertex shader ${WARN.SHADER_COMPILE}\n${code}`);
    }
    if (fragmentFailed) {
      const code = getFormattedCode(program.fragmentSource);
      console.warn(`fragment shader ${WARN.SHADER_COMPILE}\n${code}`);
    }

    if (failed) return false;

    const webGLObject = linkProgram(vertexShader, fragmentShader);
    if (!(webGLObject instanceof WebGLProgram)) {
      console.warn(`${WARN.PROGRAM_LINK}`);
      return false;
    }

    programData.webGLObject = webGLObject;
    return true;
  }

  updateVBO(vbo) {
    const vboData = this._VBOs.get(vbo);
    if (vboData.failed) return false;

    if (vboData.webGLObject) return true;

    const drawType = vbo.dynamic ? this._gl.DYNAMC_DRAW : this._gl.STATIC_DRAW;

    const webGLObject = this._gl.createBuffer();
    this._gl.bindBuffer(webGLObject);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, vbo.data, drawType);

    return true;
  }

  updateVAO(vao) {
    const vaoData = this._VAOs.get(vao);
    if (vaoData.webGLObject) return true;

    const webGLObject = this._gl.createVertexArray();
    this._gl.bindVertexArray(webGLObject);

    for (let attrib of vao) {
      const vbo = attrib.vbo;
      const vboData = this._VBOs.get(vbo);
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vboData.webGLObject);
      this._gl.vertexAttribPointer(attrib.location, vbo.components, vbo.type,
        attrib.normalized, vbo.stride, attrib.offset
      );
    }
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
  }

  draw(program, vao) {
    const programData = this._programs.get(program);
    if (!programData.webGLObject && !programData.failed) this.compile(program);
    if (programData.failed) return;

    const vaoData = this._VAOs.get(vao);
    if (vaoData.failed) return;

    if (!vaoData.webGLObject) this._updateVAO(vao);

    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);

    this._gl.clearColor(0, 0, 0, 0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    this._gl.useProgram(programData.webGLObject);
    this._gl.bindVertexArray(vaoData.webGLObject);

    this._gl.drawArrays(this._gl.TRIANGLES, 0, vao.count);
  }

  get gl() {
    return this._gl;
  }

}

const DEFAULT_NAME = `Albedo.WebGLContext`;

const ERROR = {
  MISSING_CANVAS: `no canvas provided.`
};

const WARN = {
  SHADER_COMPILE: `compilation failed!`,
  PROGRAM_LINK: `shaders linking failed!`
};
