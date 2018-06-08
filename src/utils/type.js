export const isArrayBuffer = (array) => {
  return array && array.buffer && array.buffer instanceof ArrayBuffer
    && array.byteLength;
};
