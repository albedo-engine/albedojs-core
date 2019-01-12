export const OBJECT_CTOR = {}.constructor;

export const hydrate = (dst, src) => {
  for (const k in src) {
    if (src[k] && src[k].constructor === OBJECT_CTOR) {
      if (dst[k] === undefined) dst[k] = {};
      hydrate(dst[k], src[k]);
      continue;
    }
    if (dst[k] === undefined) dst[k] = src[k];
  }
};
