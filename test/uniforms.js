import { format } from './test-utils';
import { WebGLUniformsData } from '../src/webgl/webgl-uniforms-data';

const HEADER = `Uniforms`;
console.log(WebGLUniformsData);

export default (tape) => {

  tape(format(HEADER, ``), (assert) => {
    assert.plan(1);
    assert.fail(`caca`);
  });

};
