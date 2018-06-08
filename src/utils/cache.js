export class Cache {

  constructor() {
    this._map = new WeakMap();
  }

  get(obj) {
    if (!this._map.has(obj)) this._map.set(obj, {});
    return this._map.get(obj);
  }

  remove(obj) {
    if (this._map.has(obj)) this._map.delete(obj);
  }

}
