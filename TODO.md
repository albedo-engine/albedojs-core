# TODO

* [ ] Add test suite (puppeteer)

## General

* [ ] Add error checking
* [ ] Add WebGL state to track curremt bindings. Do not bind already bound objects.
* [ ] Framebuffer and RenderBuffer should be usable outisde a draw call (e.g: read pixels)
* [ ] Improve GL state, by creating intermediary managers.
* [ ] Add ELEMENT to VBO

## Texture

* [ ] Add mipmapping
* [ ] Add support for texture level
* [X] Add texNSubImage (via dirty flag)
* [ ] Add compressed texture support
* [ ] Texture3D : find CT scan sample

## Framebuffer

* [X] Create and bind framebuffer.
* [ ] MRT

## UBO

* [ ] Improve bufferSubData
* [ ] Add helper to simplfy data writing to buffer

## VAO 

* [ ] Add update method. How to update efficiently an attribute?

## Programs

* [X] Sends all type of uniforms
* [ ] Checks for UBO
