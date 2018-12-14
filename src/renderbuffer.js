import * as CONSTANTS from './constants';

export class Renderbuffer {

  static get isRenderbuffer() {
    return true;
  }

  constructor(options) {
    const opts = Object.assign({}, DEFAULT_OPTIONS, options);

    this.internalFormat = opts.internalFormat;
    this.width = opts.width;
    this.height = opts.height;
  }

}

const DEFAULT_OPTIONS = {
  internalFormat: CONSTANTS.INTERNAL_FORMAT.RGBA8,
  width: null,
  height: null
};
