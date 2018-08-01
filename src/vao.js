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

  vertexAttrib(vbo, location, offset, normalized) {
    const attrib = new VertexAttrib(vbo, location, offset, normalized);
    this.vertexAttributes.push(attrib);
    if (this.count < 0)
      this.count = vbo.data.length / vbo.data.components;
  }

}
