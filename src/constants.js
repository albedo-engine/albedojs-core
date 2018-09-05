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
  ALPHA: 0,
  LUMINANCE: 0,
  LUMINANCE_ALPHA: 0,
  RED: 0,
  RED_INTEGER: 0,
  RG: 0,
  RG_INTEGER: 0,
  RGB: 0,
  RGB_INTEGER: 0,
  RGBA: 0,
  RGBA_INTEGER: 0
};

export const INTERNAL_FORMAT = {
  RGB: 0,
  RGBA: 0,
  LUMINANCE_ALPHA: 0,
  LUMINANCE: 0,
  ALPHA: 0,
  R8: 0,
  R16F: 0,
  R32F: 0,
  R8UI: 0,
  RG8: 0,
  RG16F: 0,
  FLOA: 0,
  RG32F: 0,
  RG8UI: 0,
  RGB8: 0,
  SRGB8: 0,
  RGB565: 0,
  R11F_G11F_B10F: 0,
  RGB9_E5: 0,
  RGB16F: 0,
  RGB32F: 0,
  RGB8UI: 0,
  RGBA8: 0,
  SRGB8_ALPHA8: 0,
  RGB5_A1: 0,
  RGB10_A2: 0,
  RGBA4: 0,
  RGBA16F: 0,
  RGBA32F: 0,
  RGBA8UI: 0
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

export const WRAPPING = {
  REPEAT: 0,
  CLAMP_TO_EDGE: 0,
  MIRRORED_REPEAT: 0
};

export const FILTERING = {
  NEAREST: 0,
  NEAREST_MIPMAP_NEAREST: 0,
  NEAREST_MIPMAP_LINEAR: 0,
  LINEAR: 0,
  LINEAR_MIPMAP_NEAREST: 0,
  LINEAR_MIPMAP_LINEAR: 0
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
  fillConstantsMap(WRAPPING);
  fillConstantsMap(FILTERING);
}
