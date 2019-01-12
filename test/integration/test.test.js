import { Runner } from '../utils/runner';

const runner = new Runner('Integration');

runner.add('Test')(function() {
  this.timeout(1000);
  expect(1).to.equal(1);
});

runner.start();
