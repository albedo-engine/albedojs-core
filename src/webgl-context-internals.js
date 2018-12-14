import { compileShader, getFormattedCode, linkProgram } from 'webgl/webgl-shader';
import { Cache } from 'utils/cache';
import { WebGLParameters } from 'webgl/webgl-parameters';
import { WebGLProgramData } from 'webgl/webgl-program-data';
import { WebGLState } from 'webgl/webgl-state';
import { WebGLTextureManager } from 'webgl/webgl-texture-manager';

export class WebGLContextInternals {

  constructor(gl) {
    this.gl = gl;
    this.parameters = WebGLParameters.fetch(this.gl);

    this.state_ = new WebGLState();
    this.VAOs_ = new Cache();
    this.VBOs_ = new Cache();
    this.UBOs_ = new Cache();
    this.FBs_ = new Cache();
    this.RBs_ = new Cache();
    this.textures_ = new Cache();
    this.programs_ = new Cache(WebGLProgramData);

    this.textureManager_ = new WebGLTextureManager(this.textures_);
  }

  initTexture(texture) {
    
  }

  initRenderbuffer(rb) {
    const rbInfo = this.RBs_.get(rb);
    if (rbInfo.failed) return null;
    if (!rbInfo.glObject) rbInfo.glObject = this.gl.createRenderbuffer();
    if (!rb.dirty) return rbInfo;

    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, rbInfo.glObject);
    this.gl.renderbufferStorageMultisample(
      this.gl.RENDERBUFFER, 4, rb.internalFormat, rb.width, rb.height
    );

    rb.dirty = false;
    return rbInfo;
  }

  initFramebuffer(fb) {
    const fbInfo = this.FBs_.get(fb);
    if (fbInfo.failed) return null;
    if (!fbInfo.glObject) fbInfo.glObject = this.gl.createFramebuffer();
    if (!fb.dirty) return fbInfo;

    this.gl.bindFramebuffer(gl.FRAMEBUFFER, fbInfo.glObject);

    for (let point in fb.attachments) {
      const attachment = fb.attachments[point];

      if (attachment.isRenderbuffer) {
        const rbInfo = this.initRenderbuffer(attachment);
        this.gl.framebufferRenderbuffer(gl.FRAMEBUFFER, point, this.gl.RENDERBUFFER, rbInfo.glObject);
      } else {
        const glTexture = texManager.getOrCreate(fb.attachments[point], this.gl);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, point, this.gl.TEXTURE_2D, glTexture, 0);
      }

    }
    fb.dirty = false;
    return fbInfo;
  }

  bindFramebuffer(fb, read) {
    const target = read ? this.gl.READ_FRAMEBUFFER : this.gl.DRAW_FRAMEBUFFER;
    // Bind screen framebuffer.
    if (!fb) {
      this.gl.bindFramebuffer(target, null);
      return;
    }
    const fbInfo = this.initFramebuffer(fb);
    this.gl.bindFramebuffer(gl.FRAMEBUFFER, fbInfo.glObject);
  }

  compile(program) {
    const programData = this.programs_.get(program);
    if (programData.failed) return;
    if (programData.glObject) return;

    const vxSrc = program.vertexSource;
    const fragSrc = program.fragmentSource;
    
    const vertexShader = compileShader(vxSrc, this.gl.VERTEX_SHADER, this.gl);
    const fragmentShader = compileShader(fragSrc, this.gl.FRAGMENT_SHADER, this.gl);

    const vertexFailed = !(vertexShader instanceof WebGLShader);
    const fragmentFailed = !(fragmentShader instanceof WebGLShader);
    const failed = vertexFailed || fragmentFailed;

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

    const webglObject = linkProgram(vertexShader, fragmentShader, this.gl);
    if (!(webglObject instanceof WebGLProgram)) {
      console.warn(`${WARN.PROGRAM_LINK}`);
      return false;
    }

    programData.glObject = webglObject;
    programData.init(this.gl);

    // TODO: this is gross. It should be changed by an Observer or whatever
    // cool pattern could help here.
    programData.uniformsData.textureManager = this.textureManager_;

    return true;
  }

  initVertexArrayObject(vao) {
    const vaoInfo = this.VAOs_.get(vao);
    if (vaoInfo.failed) return null;
    if (vaoInfo.glObject) return vaoInfo;

    const glObject = this.gl.createVertexArray();
    this.gl.bindVertexArray(glObject);

    for (let attrib of vao.vertexAttributes) {
      const vbo = attrib.vbo;
      const vboInfo = this.initVertexBufferObject(vbo);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vboInfo.glObject);
      this.gl.enableVertexAttribArray(attrib.location);
      this.gl.vertexAttribPointer(attrib.location, vbo.components, vbo.type,
        attrib.normalized, vbo.stride, attrib.offset
      );
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    vaoInfo.glObject = glObject;
    return true;
  }

  initVertexBufferObject(vbo) {
    const vboInfo = this.VBOs_.get(vbo);
    if (vboInfo.failed) return null;
    if (vboInfo.glObject) return vboInfo;

    const drawType = vbo.dynamic ? this.gl.DYNAMC_DRAW : this.gl.STATIC_DRAW;

    const glObject = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, glObject);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vbo.data, drawType);

    vboInfo.glObject = glObject;
    return vboInfo;
  }

  draw(program, vao) {
    if (!program || !vao) return;
    
    this.compile(program);

    // TODO: Do not reset texture units like that.
    this.textureManager_.reset();

    const programData = this.programs_.get(program);
    const vaoInfo = this.initVertexArrayObject(vao);
    if (!vaoInfo === null) return;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    programData.use(this.gl);
    programData.sendUniforms(program.uniforms, this.gl);
    programData.bindVAO(vaoInfo.glObject, this.gl);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, vao.count);
  }

}
