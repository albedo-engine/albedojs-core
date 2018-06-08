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

const gl = WebGL2RenderingContext;
if (gl) {
  for (let k in TYPES) TYPES[k] = gl[k];
}
