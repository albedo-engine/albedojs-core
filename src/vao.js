import { VBO } from './vbo';

class VertexAttrib {

  constructor(vbo, location, offset, normalized) {
    this.vbo = vbo;
    this.location = location;
    this.offset = offset;
    this.normalized = normalized;
  }

}

export class VAO {

  constructor() {
    this.vertexAttributes = [];
    this.count = -1;
  }

  vertexAttrib(info) {
    if (!info.vbo || !(info.vbo instanceof VBO)) {
      throw new TypeError(`${CLASS_NAME}: ${ERRORS.MISSING_VBO}.`);
    }

    const vbo = info.vbo;
    const location = info.location || 0;
    const offset = info.offset || 0;
    const normalized = info.normalized || false;

    const attrib = new VertexAttrib(vbo, location, offset, normalized);
    this.vertexAttributes.push(attrib);
    if (this.count < 0) { this.count = vbo.data.length / vbo.components; }

    return this;
  }

}

const CLASS_NAME = `VAO`;
const ERRORS = {
  MISSING_VBO: `provided VBO is not of type Albedo.VBO`
};
