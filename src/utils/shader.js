const compileShader = (source, type, gl) => {
  const shaderID = gl.createShader(type);
  gl.shaderSource(shaderID, source);
  gl.compileShader(shaderID);

  const success = gl.getShaderParameter(shaderID, gl.COMPILE_STATUS);
  if (!success) {
    const log = gl.getShaderInfoLog(shaderID);
    gl.deleteShader(shaderID);
    return log;
  }
  return shaderID;
};

export const compileProgram = (vertexSource, fragmentSource, gl) => {
    const result = {
      vertex: compileShader(vertexSource, gl.VERTEX_SHADER, gl),
      fragment: compileShader(fragmentSource, gl.FRAGMENT_SHADER, gl),
      program: null
    };

    if (!(result.vertex instanceof WebGLShader)
        || !(result.fragment instanceof WebGLShader)) return result;
      
    result.program = gl.createProgram();
    gl.attachShader(result.program, result.vertex);
    gl.attachShader(result.program, result.fragment);
    gl.linkProgram(result.program);

    const success = gl.getProgramParameter(result.program, gl.LINK_STATUS);
    if (!success) {
      result.program = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
    }

    return result;
};

export const getFormattedCode = (source) => {
  const split = source.split(`\n`); 
  for (let i = 0; i < split.length; ++i)
    split[i] = `${i + 1}:${split[i]}`;

  return split.join(`\n`);
};
