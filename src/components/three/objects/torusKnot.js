import * as THREE from 'three';

export function createTorusKnot(material, {
  radius = 1,
  tube = 0.4,
  tubularSegments = 100,
  radialSegments = 16,
  p = 2,
  q = 3
} = {}) {
  const geometry = new THREE.TorusKnotGeometry(
    radius,
    tube,
    tubularSegments,
    radialSegments,
    p,
    q
  );
  return new THREE.Mesh(geometry, material);
}
