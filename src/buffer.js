import { isArrayBuffer } from 'utils/type';
import { TYPES } from './constants';

export class Buffer {

  constructor(options) {
    if (!options)
      throw new TypeError(`${ERROR.HEAD}.ctor(): ${ERROR.MISSING_DATA}`);
    if (options.data && !isArrayBuffer(options.data))
      throw new TypeError(`${ERROR.HEAD}.ctor(): ${ERROR.NOT_AN_ARRAYBUFFER}`);

    // TODO: prevent developer to change that at runtime.
    this.data = options.data || options;
    this.type = options.type || this._dataType();
    this.components = options.components || 3;
    this.offset = options.offset || 0;
    this.stride = options.stride || 0;
    this.dynamic = options.dynamic || false;
    this.normalized = options.normalized || false;

    this.dirty = true;
  }

  _dataType() {
    if (this.data instanceof Float32Array) return TYPES.FLOAT;
    else if (this.data instanceof Uint16Array) return TYPES.UNSIGNED_SHORT;
    else if (this.data instanceof Int16Array) return TYPES.SHORT;
    else if (this.data instanceof Uint32Array) return TYPES.UNSIGNED_INT;
    else if (this.data instanceof Int32Array) return TYPES.INT;
    else if (this.data instanceof Int8Array) return TYPES.BYTE;
    else if (this.data instanceof Uint8Array) return TYPES.UNSIGNED_BYTE;

    throw new TypeError(`${ERROR.HEAD}: ${ERROR.TYPE_NOT_FOUND}`);
  }

}

const ERROR = {
  HEAD: `Buffer`,
  MISSING_DATA: `the provided arguments does not contain a valid 'data' ArrayBuffer.`,
  NOT_AN_ARRAYBUFFER: `the provided 'data' buffer is not an ArrayBuffer.`,
  WRONG_ASSIGN: `assignation of a non ArrayBuffer to the 'data' attribute.`,
  TYPE_NOT_FOUND: `GL type can not be deduced from the given ArrayBuffer.`
};
