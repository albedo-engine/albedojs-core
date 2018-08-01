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

  draw(program, vao) {

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
