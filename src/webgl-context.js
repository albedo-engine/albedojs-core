import { Cache } from 'utils/cache';
import { compileShader, getFormattedCode, linkProgram } from 'webgl/webgl-shader';
import { WebGLProgramData } from 'webgl/webgl-program-data';
import { WebGLTextureManager } from 'webgl/webgl-texture-manager';

const JSPrivateAttributes = new WeakMap();
const self = (key) => {
return JSPrivateAttributes.get(key);
};

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

    this._gl = options.canvas.getContext(`webgl2`, contextOptions);
    const devicePixelRatio = window.devicePixelRatio || 1;
    options.canvas.style.width = `${options.canvas.clientWidth}px`;
    options.canvas.style.height = `${options.canvas.clientHeight}px`;
    options.canvas.width = options.canvas.clientWidth * devicePixelRatio;
    options.canvas.height = options.canvas.clientHeight * devicePixelRatio;

    this._verbose = {};
    this._verbose.name = options.name || DEFAULT_NAME;
    this._verbose.logAll = options.verbose || false;

    JSPrivateAttributes.set(this, {
      textureManager: new WebGLTextureManager(),
      vaoList: new Cache(),
      vboList: new Cache(),
      uboList: new Cache()
    });

    this._VBOs = new Cache();
    this._VAOs = new Cache();
    this._UBOs = new Cache();
    this._programs = new Cache(WebGLProgramData);
  }

  compile(program) {
    const vxSrc = program.vertexSource;
    const fragSrc = program.fragmentSource;
    const vertexShader = compileShader(vxSrc, this._gl.VERTEX_SHADER, this._gl);
    const fragmentShader = compileShader(fragSrc, this._gl.FRAGMENT_SHADER, this._gl);
    const vertexFailed = !(vertexShader instanceof WebGLShader);
    const fragmentFailed = !(fragmentShader instanceof WebGLShader);
    const failed = vertexFailed || fragmentFailed;

    const programData = this._programs.get(program);
    programData.failed = failed;

    if (vertexFailed) {
      const code = getFormattedCode(vxSrc);
      console.warn(`vertex shader ${WARN.SHADER_COMPILE}\n${vertexShader}`);
      console.warn(`${code}`);
    }
    if (fragmentFailed) {
      const code = getFormattedCode(fragSrc);
      console.warn(`fragment shader ${WARN.SHADER_COMPILE}\n${fragmentShader}`);
      console.warn(`${code}`);
    }

    if (failed) return false;

    const webglObject = linkProgram(vertexShader, fragmentShader, this._gl);
    if (!(webglObject instanceof WebGLProgram)) {
      console.warn(`${WARN.PROGRAM_LINK}`);
      return false;
    }

    programData.webglObject = webglObject;
    programData.init(this._gl, {});

    // TODO: this is gross. It should be changed by an Observer or whatever
    // cool pattern could help here.
    programData.uniformsData.textureManager = self(this).textureManager;

    return true;
  }

  updateVBO(vbo) {
    const vboData = this._VBOs.get(vbo);
    if (vboData.failed) return false;

    if (vboData.webglObject) return true;

    const drawType = vbo.dynamic ? this._gl.DYNAMC_DRAW : this._gl.STATIC_DRAW;

    const webglObject = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, webglObject);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, vbo.data, drawType);

    vboData.webglObject = webglObject;
    return true;
  }

  updateVAO(vao) {
    const vaoData = this._VAOs.get(vao);
    if (vaoData.webglObject) return true;

    const webglObject = this._gl.createVertexArray();
    this._gl.bindVertexArray(webglObject);

    for (let attrib of vao.vertexAttributes) {
      const vbo = attrib.vbo;
      const vboData = this._VBOs.get(vbo);
      this.updateVBO(vbo);

      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vboData.webglObject);
      this._gl.enableVertexAttribArray(attrib.location);
      this._gl.vertexAttribPointer(attrib.location, vbo.components, vbo.type,
        attrib.normalized, vbo.stride, attrib.offset
      );
    }
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);

    vaoData.webglObject = webglObject;
    return true;
  }

  draw(program, vao) {
    if (!program || !vao) return;

    self(this).textureManager.reset();

    const programData = this._programs.get(program);
    if (programData.failed) return;
    if (!programData.webglObject) this.compile(program);

    const vaoData = this._VAOs.get(vao);
    if (vaoData.failed) return;
    this.updateVAO(vao);

    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);

    this._gl.clearColor(0, 0, 0, 0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    programData.use(this._gl);
    programData.sendUniforms(program.uniforms, this._gl);
    programData.bindVAO(vaoData.webglObject, this._gl);

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
