export const compileShader = (source, type, gl) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    return log;
  }
  return shader;
};

export const linkProgram = (vertexShader, fragmentShader, gl) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    return log;
  }

  return program;
};

export const getFormattedCode = (source) => {
  const split = source.split(`\n`);
  for (let i = 0; i < split.length; ++i)
    split[i] = `${i + 1}:${split[i]}`;

  return split.join(`\n`);
};
