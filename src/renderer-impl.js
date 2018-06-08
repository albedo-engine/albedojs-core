import { compileProgram, getFormattedCode } from 'utils/shader';
import { Cache } from 'utils/cache';
import { WebGLProgramInfo } from 'webgl/webgl-program-info';

export class InternalRenderer {

  constructor(gl, verbose) {
    this._gl = gl;
    this._verbose = verbose;

    this._buffersCache = new Cache();
    this._programsCache = new Cache();
  }

  render(attributes, program) {
    // TODO: add viewport parameters in renderer.
    this._gl.viewport(0, 0, 100, 100);
    // TODO: add clear parameters to renderer.
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

    // Setups the buffer if it is not already done.
    this._setupBuffers(attributes);

    const programCache = this._programsCache.get(program);

    if (!programCache.programData && !programCache.failed)
      this._setupProgram(program, programCache);
    if (programCache.failed) return;

    const programData = programCache.programData;

    // Setups the attributes VAO if it is not already done.
    this._setupAttributesVAO(programData, attributes);

    //if (!attributesCache.vao || attributes.dirty)
    //this._setupAttributesGroup(attributes, attributesCache);

    /*for (let attributeName in programData.attributesInfo) {
      // The attribute is not part of the shader, no processing has to be done.
      if (!(attributeName in attributes)) continue;

      const buffer = attributes[attributeName];
      const attributeCache = this._attributes.get(userAttribute);
      const attributeInfo = programInfo.programData.attributesInfo;
      if (!attributeCache.webglBuffer) this._setupAttribute(userAttribute);
      if (attributeCache.failed) continue;

      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, attributeCache.webglBuffer);
      this._gl.vertexAttribPointer(
        attributeInfo[attributeName].location,
        userAttribute.components,
        userAttribute.type,
        userAttribute.normalized,
        userAttribute.stride,
        userAttribute.offset
      );
    }*/

    this._gl.useProgram(programInfo.webGLProgram);
  }

  _setupAttributesVAO(programData, attributes) {
    const attributesCache = this._attributesCache.get(attributes);
    if (attributesCache.failed) return;
    if (attributesCache.vao && !attributes.dirty) return;

    if (attributesCache.vao)
      attributesCache.vao = this._gl.createVertexArray();

    this._gl.bindVertexArray(attributesCache.vao);
    for (let a in attributes.list) {

      this._gl.enableVertexAttribArray(positionAttributeLocation);
    }

  }

  _setupBuffers(attributes) {
    for (let b in attributes.list) {
      const buffer = attributes.get(b);
      const bufferCache = this._buffersCache.get(buffer);
      if (bufferCache.failed) continue;
      if (bufferCache.buffer && !buffer.dirty) continue;

      const type = buffer.dynamic ? this._gl.DYNAMIC_DRAW : this._gl.STATIC_DRAW;

      bufferCache.buffer = bufferCache.buffer || this._gl.createBuffer();
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, bufferCache.buffer);
      this._gl.bufferData(this._gl.ARRAY_BUFFER, buffer.data, type);
    }
  }

  _setupBuffer(attribute) {
    const info = this._attributes.get(attribute);

    if (!attribute.data || attribute.data.length === 0) return;

    if (this._verbose.logAll)
      console.log(`${this._verbose.name}: ${LOG.NEW_ATTRIB}`);

    // TODO: add error checking here.
    const webglBuffer = this._gl.createBuffer();
    const type = attribute.dynamic ? this._gl.DYNAMIC_DRAW : this._gl.STATIC_DRAW;
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, webglBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, attribute.data, type);

    info.webglBuffer = webglBuffer;
    info.failed = false;
  }

  _setupProgram(program, programCache) {
    if (this._verbose.logAll)
      console.log(`${this._verbose.name}: ${LOG.NEW_PROGRAM}`);

    const vertexSrc = program.vertexShader;
    const fragmentSrc = program.fragmentShader;

    const status = compileProgram(vertexSrc, fragmentSrc, this._gl);
    if (!(status.vertex instanceof WebGLShader)) {
      const code = getFormattedCode(vertexSrc);
      const glMsg = status.vertex;
      const msg = `${this._verbose.name}: ${WARN.VTX_FAIL}\n${glMsg}\n${code}`;
      console.warn(msg);
      programCache.failed = true;
    }
    if (!(status.fragment instanceof WebGLShader)) {
      const code = getFormattedCode(vertexSrc);
      const glMsg = status.fragment;
      console.warn(`${this._verbose.name}: ${WARN.FRAG_FAIL}\n${glMsg}\n${code}`);
      programCache.failed = true;
    }
    if (!(status.program instanceof WebGLProgram)) {
      console.warn(`Albedo.Renderer: program link failed!`);
      const glMsg = status.program;
      if (status.program) console.warn(`${this._verbose.name}: ${glMsg}`);
      programCache.failed = true;
    }

    if (programCache.failed) return;

    programCache.programData = new WebGLProgramInfo(status.program);
    programCache.programData.init(this._gl);
  }
}

const LOG = {
  NEW_PROGRAM: `creating WebGL program...`,
  NEW_ATTRIB: `creating WebGL attribute...`
};

const WARN = {
  VTX_FAIL: `vertex compilation failed!`,
  FRAG_FAIL: `fragment compilation failed!`
};
