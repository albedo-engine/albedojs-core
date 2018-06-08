import { Buffer } from './buffer';

import { OBJECT_CTOR } from 'utils/object';

export class Attributes {

  constructor(buffers) {
    this.list = {};
    this.dirty = true;

    if (buffers && buffers.constructor !== OBJECT_CTOR)
      throw new TypeError(`${ERROR.HEAD}.ctor(): ${ERROR.WRONG_CTOR_ARGS}`);

    for (let key in buffers) this.add(key, buffers[key]);
  }

  add(name, buffer) {
    if (!(buffer instanceof Buffer))
      throw new TypeError(`${ERROR.HEAD}.add(): ${ERROR.NOT_A_BUFFER}`);

    this.list[name] = buffer;
    this.dirty = true;
  }

  remove(name) {
    this.list[name] = undefined;
    this.dirty = true;
  }

  get(name) {
    return this.list[name];
  }

}

const ERROR = {
  HEAD: `Attributes`,
  WRONG_CTOR_ARGS: `the provided argument is not an object.`,
  NOT_A_BUFFER: `provided object is not of type Albedo.Buffer.`
};
