export class Runner {

  constructor(name) {
    this._runnerName = name || 'Test Suite';
    this._currentGroup = '';
    this._groups = {};

    this.group(this._currentGroup);
  }

  group(name) {
    if (!(name in this._groups)) { this._groups[name] = {}; }
    this._currentGroup = name || '';
  }

  add(testName) {
    return ((callback) => {
      const list = this._groups[this._currentGroup];
      list[testName] = callback;
    });
  }

  start() {
    describe(this._runnerName, () => {
      debugger;
      // Executes the default group: meaning no nested `describe'.
      const defaultGroup = this._groups[''];
      this._execGroupTests(defaultGroup);
      // Executes all nested groups.
      for (const name in this._groups) {
        if (name === '') { continue; }
        const group = this._groups[name];
        describe(name, () => { this._execGroupTests(group); });
      }
    });
  }

  _execGroupTests(group) {
    for (const testName in group) {
      it(testName, function() {
        const callback = group[testName];
        callback.call(this);
      });
    }
  }

}
