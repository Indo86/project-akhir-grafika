import * as THREE from 'three';
import { ParametricGeometry } from 'three-stdlib';
export function createKleinBottle(material, { segments = 25, slices = 25, scale = 0.1 } = {}) {
  const kleinFunc = function(u, v, target) {
    u *= Math.PI * 2;
    v *= Math.PI * 2;
    u = u * 2;
    let x, y, z;

    if (u < Math.PI) {
      x = 3 * Math.cos(u) * (1 + Math.sin(u))
        + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v) * Math.cos(u);
      z = -8 * Math.sin(u)
        - (2 * (1 - Math.cos(u) / 2)) * Math.cos(v) * Math.sin(u);
    } else {
      x = 3 * Math.cos(u) * (1 + Math.sin(u))
        + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
      z = -8 * Math.sin(u);
    }
    y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

    target.set(x * scale, y * scale, z * scale);
  };

  const geometry = new ParametricGeometry(kleinFunc, segments, slices);
  return new THREE.Mesh(geometry, material);
}