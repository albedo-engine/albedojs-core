# Architecture

# API

# Examples

## Cube with core

```javascript
import Albedo from 'albedo-core';

const renderer = new Albedo.renderer(canvas);
const cubeGeom = new Albedo.Geometry.Cube();
const material = new Albedo.Material.Material();

const render = () => {
  renderer.useMaterial(material);
  renderer.render(cubeGeom);
};
```

## Cube with scene graph

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
