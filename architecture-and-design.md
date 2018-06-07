# Architecture

## Core API

### Math

* Expose glMatrix.

### Buffer

* Data that can be send to GPU (stride, etc...)

### Program

* Compile vertex and fragment.
* Not compiled by default, only when used.
* Shares uniform state with Material.
* Cache uniform data, and uniform location.
* Contains the attributes.

```javascript
// Expected attributes and uniforms
const shader = new Shader(fragment, vertex, uniforms, attributes);
```

### Components

#### Material

* Contain a pointer to a shader.

e.g:

```javascript
// uniforms describe the expected uniforms.
const shader = new Shader(fragment, vertex, uniforms, attributes);
// shader.compile() -> not mandatory.
const material = new Material(shader); // copies the uniform
```

#### Renderer

* Renders a set of attributes with a material.
* Uses material data to apply special blending, etc...
* Can render to a bound framebuffer.

#### Primitive

* Use a buffer 

#### Transform


## Scene Graph API

### Traversal

* Takes the closest material to a primitive for rendering. Meaning that it does not force a node to have a primitive AND a material.

## Examples

### Cube with core

```javascript
import Albedo from 'albedo-core';

const renderer = new Albedo.renderer(canvas);
const vertices = new Albedo.Buffer(...);
const shader = new Albedo.Shader(...);
const material = new Albedo.Material.Material();

const attributes = {
  vertices: vertices
};

const render = () => {
  renderer.useMaterial(material);
  renderer.render(attributes, shader);
};
```

### Cube with scene graph

```javascript
import Albedo from 'albedo-core';

const renderer = new Albedo.renderer(canvas);
const cubeGeom = new Albedo.Geometry.Cube();
const material = new Albedo.Material.Material();

const rootNode = new Albedo.Node();
rootNode.addComponent(cubeGeom);
rootNode.addComponent(material);

const render = () =>
  rootNode.render(renderer, camera);
};
```
