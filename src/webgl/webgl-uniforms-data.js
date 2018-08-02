/* eslint camelcase: 0 */
import { GLSLTYPES } from './constants';
import { ARRAY_TYPE } from 'utils/type';

export class WebGLUniformsData {

  constructor() {
    this.list = {};
  }

  init(webglObject, gl) {
    const nbUniforms = gl.getProgramParameter(webglObject, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < nbUniforms; i++) {
      const info = gl.getActiveUniform(webglObject, i);
      const addr = gl.getUniformLocation(webglObject, info.name);
      parse(info.name, addr, info.type, this.list);
    }
  }

  update(uniforms, gl) {
    for (let u in this.list) {
      const uniform = uniforms[u];
      if (uniform) this.list[u].upload(uniform, gl);
    }
  }

}

const tokenize = (name) => {
  const tokens = [];
  let i = 0;
  let bracket = -1;
  let dot = -1;
  let bracketEnd = -1;

  while (i < name.length) {
    bracket = name.indexOf(`[`, i);
    dot = name.indexOf(`.`, i);
    bracketEnd = name.indexOf(`]`, bracket);

    // SingleUniform.
    //
    // We can safely stop the parsing here, the parser reached the
    // deepest uniform in the hierarchy.
    if (bracket === -1 && dot === -1) {
      tokens.push({ name: name.substr(i), type: SingleUniform });
      break;
    }

    bracket = bracket === -1 ? Number.POSITIVE_INFINITY : bracket;
    dot = dot === -1 ? Number.POSITIVE_INFINITY : dot;

    // Struct uniform.
    if (dot < bracket) {
      tokens.push({ name: name.substr(i, dot), type: StructUniform });
      i = dot + 1;
      continue;
    }

    // ArrayUniform.
    tokens.push({ name: name.substr(i, bracket), type: ArrayUniform });
    const decay = name.substr(bracket + 1, bracketEnd - bracket - 1);
    i = bracketEnd + 1;
    if (dot === bracketEnd + 1) {
      tokens.push({ name: decay, type: StructUniform });
      i++;
    } else
      tokens.push({ name: decay, type: SingleUniform });
  }
  return tokens;
};

const parse = (name, addr, type, parent) => {
  const tokens = tokenize(name);
  let container = parent;
  for (let i = 0; i < tokens.length; ++i) {
    const n = tokens[i].name;
    if (!container[n]) {
      const UniformConstructor = tokens[i].type;
      container[n] = new UniformConstructor(n, addr, type);
    }
    container = container[n].list;
  }
};


/*
 * Uniforms class used during the parsing. An uniforms hierarchy is built at
 * shader compilation time, and reused for the whole life of the shader.
 *
 * Uniform: only contain a name and an empty upload method.
 * ArrayUniform: stores an array of uniform, and updates all its children.
 * StructUniform: uniform using a custom GLSL type, upates all its children.
 */

class Uniform {

  constructor(name) {
    this.name = name;
  }

  upload() {}

}

class StructUniform extends Uniform {

  constructor(name) {
    super(name);
    this.list = {};
  }

  upload(uniform, gl) {
    for (let i in uniform) this.list[i].upload(uniform[i], gl);
  }

}

class ArrayUniform extends Uniform {

  constructor(name) {
    super(name);
    this.list = [];
  }

  upload(uniform, gl) {
    for (let i = 0; i < uniform.length; ++i) {
      if (i >= this.list.length) break;
      this.list[i].upload(uniform[i], gl);
    }
  }

}

class SingleUniform extends Uniform {

  constructor(name, addr, type) {
    super(name);

    this.components = GLSLTYPES_TO_COMPONENTS[type];
    this.value = this.components > 1 ? new ARRAY_TYPE(this.components) : null;
    this.addr = addr;
    this.funcName = GLSLTYPES_TO_UNIFORM_FUNC[type];

    if (this.components === 1) this.upload = this.uploadSingle;
    else this.upload = this.uploadMatrix;
  }

  uploadSingle(value, gl) {
    if (value !== this.value) {
      this.value = value;
      gl[this.funcName](this.addr, value);
    }
  }

  uploadMatrix(values, gl) {
    for (let i = 0; i < values.length; ++i) {
      if (values[i] === this.value[i]) continue;
      for (let j = 0; j < values.length; ++j) this.value[j] = values[j];
      gl[this.funcName](this.addr, false, values);
      return;
    }
  }

}

/*
 * Maps used to map each uniform of the uniform hierarchy to the GL method used
 * to upload it on the GPU, as well as the number of components it has, etc...
 */

/*
 * Convertes hexadecimal WebGL type to a string used to query
 * the associated uniform function from the WebGL context.
 */
const GLSLTYPES_TO_UNIFORM_FUNC = {};
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.BOOL] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.BOOL_VEC2] = `uniform2i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.BOOL_VEC3] = `uniform3i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.BOOL_VEC4] = `uniform4i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT] = `uniform1f`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_VEC2] = `uniform2f`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_VEC3] = `uniform3f`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_VEC4] = `uniform4f`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_MAT2] = `uniformMatrix2fv`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_MAT3] = `uniformMatrix3fv`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_MAT4] = `uniformMatrix4fv`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_MAT2x3] = `uniformMatrix2x3fv`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_MAT2x4] = `uniformMatrix2x4fv`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_MAT3x2] = `uniformMatrix3x2fv`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_MAT3x4] = `uniformMatrix3x4fv`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_MAT4x2] = `uniformMatrix4x2fv`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.FLOAT_MAT4x3] = `uniformMatrix4x3fv`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.INT] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.INT_VEC2] = `uniform2i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.INT_VEC3] = `uniform3i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.INT_VEC4] = `uniform4i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.UNSIGNED_INT] = `uniform1ui`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.UNSIGNED_INT_VEC2] = `uniform2ui`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.UNSIGNED_INT_VEC3] = `uniform3ui`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.UNSIGNED_INT_VEC4] = `uniform4ui`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.SAMPLER_2D] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.SAMPLER_2D_SHADOW] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.SAMPLER_2D_ARRAY] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.SAMPLER_2D_ARRAY_SHADOW] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.SAMPLER_CUBE] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.SAMPLER_CUBE_SHADOW] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.SAMPLER_3D] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.INT_SAMPLER_2D] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.INT_SAMPLER_2D_ARRAY] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.INT_SAMPLER_CUBE] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.INT_SAMPLER_3D] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.UNSIGNED_INT_SAMPLER_2D] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.UNSIGNED_INT_SAMPLER_2D_ARRAY] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.UNSIGNED_INT_SAMPLER_CUBE] = `uniform1i`;
GLSLTYPES_TO_UNIFORM_FUNC[GLSLTYPES.UNSIGNED_INT_SAMPLER_3D] = `uniform1i`;

/*
 * Converts hexadecimal WebGL type to a number of components.
 */
const GLSLTYPES_TO_COMPONENTS = {};
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.BOOL] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.BOOL_VEC2] = 2;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.BOOL_VEC3] = 3;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.BOOL_VEC4] = 4;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_VEC2] = 2;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_VEC3] = 3;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_VEC4] = 4;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_MAT2] = 4;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_MAT3] = 9;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_MAT4] = 16;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_MAT2x3] = 6;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_MAT2x4] = 8;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_MAT3x2] = 6;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_MAT3x4] = 2;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_MAT4x2] = 8;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.FLOAT_MAT4x3] = 2;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.INT] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.INT_VEC2] = 2;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.INT_VEC3] = 3;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.INT_VEC4] = 4;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.UNSIGNED_INT] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.UNSIGNED_INT_VEC2] = 2;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.UNSIGNED_INT_VEC3] = 3;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.UNSIGNED_INT_VEC4] = 4;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.SAMPLER_2D] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.SAMPLER_2D_SHADOW] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.SAMPLER_2D_ARRAY] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.SAMPLER_2D_ARRAY_SHADOW] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.SAMPLER_CUBE] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.SAMPLER_CUBE_SHADOW] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.SAMPLER_3D] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.INT_SAMPLER_2D] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.INT_SAMPLER_2D_ARRAY] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.INT_SAMPLER_CUBE] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.INT_SAMPLER_3D] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.UNSIGNED_INT_SAMPLER_2D] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.UNSIGNED_INT_SAMPLER_2D_ARRAY] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.UNSIGNED_INT_SAMPLER_CUBE] = 1;
GLSLTYPES_TO_COMPONENTS[GLSLTYPES.UNSIGNED_INT_SAMPLER_3] = 1;
