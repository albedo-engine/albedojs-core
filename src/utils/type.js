export const isArrayBuffer = (array) => {
  return array && array.buffer && array.buffer instanceof ArrayBuffer
    && array.byteLength;
};

export const ARRAY_TYPE = (typeof Float32Array !== `undefined`) ? Float32Array : Array;
