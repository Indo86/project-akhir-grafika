import * as THREE from 'three';

export function createNonagon() {
  const shape = new THREE.Shape();
  const sides = 9;
  const radius = 1;

  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2; // supaya sejajar sumbu X-Z

  return mesh;
}
