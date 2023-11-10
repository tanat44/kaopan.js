# projectichi

The most simple way to render in WebGL. 
1. Simplify rendering objects with JSON message or Typed objects
1. One library for both 2D (canvas-like) and 3D (WebGL) application
1. Run very smooth up to 100k objects (using GPU Instanced Mesh)
1. Three.js WebGL engine at heart for full customization

## What projectichi offers?
1. Time-and-time writing WebGL application requires you to:
  1. Raytrace the mouse position to detect which object is clicked
  1. Setup camera / lighting / mouse panning and zooming
  1. Write a class to store materials / mesh to optimize performance (reduce draw calls)
  1. Store references to 3D objects and retrieve when you want to update the rendering property
  1. Animate object with path / velocity / acceleration
  1. Load and store 3D model (e.g. .gltf file)
1. Create a 2D drawing application experience (like HTML5 canvas). It's possible to change from 2D look to 3D just by changing the camera property. 

## Powerful JSON RenderObject
