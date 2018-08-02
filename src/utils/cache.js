export class Cache {

  constructor(BaseClass) {
    this._BaseClass = BaseClass;
    this._map = new WeakMap();
  }

  get(obj) {
    if (!this._map.has(obj)) {
      if (this._BaseClass) this._map.set(obj, new this._BaseClass());
      else this._map.set(obj, {});
    }
    return this._map.get(obj);
  }

  remove(obj) {
    if (this._map.has(obj)) this._map.delete(obj);
  }

}
