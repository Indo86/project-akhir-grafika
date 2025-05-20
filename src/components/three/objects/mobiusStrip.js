import * as THREE from 'three';
import { ParametricGeometry } from 'three-stdlib';
export function createMobiusStrip(material, { segments = 100, slices = 20, scale = 1 } = {}) {
  const mobiusFunc = (u, t, target) => {
    u *= Math.PI * 2;
    t = (t - 0.5) * 2;
    const x = (1 + t / 2 * Math.cos(u / 2)) * Math.cos(u);
    const y = (1 + t / 2 * Math.cos(u / 2)) * Math.sin(u);
    const z = t / 2 * Math.sin(u / 2);
    target.set(x * scale, y * scale, z * scale);
  };

  const geometry = new ParametricGeometry(mobiusFunc, segments, slices);
  return new THREE.Mesh(geometry, material);
}
