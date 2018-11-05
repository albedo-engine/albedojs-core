import { WebGLContextInternals } from 'webgl-context-internals';

const JSPrivateAttributes = new WeakMap();
const self = (key) => { return JSPrivateAttributes.get(key); };

export class WebGLContext {

  constructor(options) {
    if (!options.canvas)
      throw new Error(`Renderer.ctor(): ${ERROR.MISSING_CANVAS}`);

    const contextOptions = {
      alpha: false,
      depth: true,
      stencil: true,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: `default`
    };

    const gl = options.canvas.getContext(`webgl2`, contextOptions);

    const devicePixelRatio = window.devicePixelRatio || 1;
    options.canvas.style.width = `${options.canvas.clientWidth}px`;
    options.canvas.style.height = `${options.canvas.clientHeight}px`;
    options.canvas.width = options.canvas.clientWidth * devicePixelRatio;
    options.canvas.height = options.canvas.clientHeight * devicePixelRatio;

    this._verbose = {};
    this._verbose.name = options.name || DEFAULT_NAME;
    this._verbose.logAll = options.verbose || false;

    JSPrivateAttributes.set(this, {
      gl: gl,
      internals: new WebGLContextInternals(gl)
    });

    //self(this).glParameters.requestDefaultParams_(gl);
  }

  compile(program) {
    self(this).internals.compile(program);
  }

  initFramebuffer(fb) {
    //self(this).internals.compile(program);
  }

  bindFramebuffer(fb) {
    self(this).internals.bindFramebuffer(fb);
  }

  initVertexBufferObject(vbo) {
    self(this).internals.initVertexBufferObject(vbo);
  }
  
  initVertexArrayObject(vao) {
    self(this).internals.initVertexArrayObject(vao);
  }

  draw(program, vao) {
    self(this).internals.draw(program, vao);
  }

  clear() {}

  viewport() {}

  get gl() {
    return self(this).gl;
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
