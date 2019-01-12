import { Runner } from '../utils/runner';

const runner = new Runner('WebGL Uniforms Processing');

runner.group('toto');
runner.add('WebGLUniformsData')(function() {
  this.timeout(1000);
});

runner.start();
