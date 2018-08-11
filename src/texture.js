import { hydrate } from 'utils/object';
import { TYPES } from 'constants';

export class Texture {

  constructor(options) {
    const opts = {};
    hydrate(opts, options);
    this._data = opts.data || null;
    this.type = opts.type || TYPES.UNSIGNED_BYTE;
    //this.internalFormat = opts.internalFormat || FOMRAT.UNSIGNED_BYTE;

    this.dirty = true;
  }

  set data(data) {
    this._data = data;
    this.dirty = true;
  }

  get data() {
    return this._data;
  }

  _guessFormat() {

  }

}
