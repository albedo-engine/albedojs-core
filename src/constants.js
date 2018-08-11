/* eslint camelcase: 0 */

export const TYPES = {
  BYTE: 0,
  UNSIGNED_BYTE: 0,
  SHORT: 0,
  UNSIGNED_SHORT: 0,
  UNSIGNED_SHORT_5_6_5: 0,
  UNSIGNED_SHORT_5_5_5_1: 0,
  UNSIGNED_SHORT_4_4_4_4: 0,
  INT: 0,
  UNSIGNED_INT: 0,
  UNSIGNED_INT_5_9_9_9_REV: 0,
  UNSIGNED_INT_2_10_10_10_REV: 0,
  UNSIGNED_INT_10F_11F_11F_REV: 0,
  UNSIGNED_INT_24_8: 0,
  HALF_FLOAT: 0,
  FLOAT: 0
};

export const FORMAT = {

};

export const INTERNAL_FORMAT = {

};

export const GLSLTYPES = {
  BOOL: 0,
  BOOL_VEC2: 0,
  BOOL_VEC3: 0,
  BOOL_VEC4: 0,

  FLOAT: 0,
  FLOAT_VEC2: 0,
  FLOAT_VEC3: 0,
  FLOAT_VEC4: 0,
  FLOAT_MAT2: 0,
  FLOAT_MAT3: 0,
  FLOAT_MAT4: 0,
  FLOAT_MAT2x3: 0,
  FLOAT_MAT2x4: 0,
  FLOAT_MAT3x2: 0,
  FLOAT_MAT3x4: 0,
  FLOAT_MAT4x2: 0,
  FLOAT_MAT4x3: 0,

  INT: 0,
  INT_VEC2: 0,
  INT_VEC3: 0,
  INT_VEC4: 0,
  UNSIGNED_INT: 0,
  UNSIGNED_INT_VEC2: 0,
  UNSIGNED_INT_VEC3: 0,
  UNSIGNED_INT_VEC4: 0,

  SAMPLER_2D_SHADOW: 0,
  SAMPLER_2D: 0,
  SAMPLER_2D_ARRAY: 0,
  SAMPLER_2D_ARRAY_SHADOW: 0,
  SAMPLER_CUBE: 0,
  SAMPLER_CUBE_SHADOW: 0,
  SAMPLER_3D: 0,
  INT_SAMPLER_2D: 0,
  INT_SAMPLER_3D: 0,
  INT_SAMPLER_CUBE: 0,
  INT_SAMPLER_2D_ARRAY: 0,
  UNSIGNED_INT_SAMPLER_2D: 0,
  UNSIGNED_INT_SAMPLER_3D: 0,
  UNSIGNED_INT_SAMPLER_CUBE: 0,
  UNSIGNED_INT_SAMPLER_2D_ARRAY: 0
};

const fillConstantsMap = (map) => {
  for (let k in map) map[k] = gl[k];
};

const gl = WebGL2RenderingContext;
if (gl) {
  fillConstantsMap(TYPES);
  fillConstantsMap(GLSLTYPES);
  fillConstantsMap(FORMAT);
  fillConstantsMap(INTERNAL_FORMAT);
}
