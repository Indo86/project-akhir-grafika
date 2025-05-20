export default class ObjectControls {
  constructor(sceneManager) {
    this.sm = sceneManager;
  }

  setScale(mesh, { x, y, z }) {
    mesh.scale.set(x, y, z);
  }

  setRotation(mesh, { x, y, z }) {
    mesh.rotation.set(x, y, z);
  }

  setPosition(mesh, { x, y, z }) {
    mesh.position.set(x, y, z);
  }

  setColor(mesh, hex) {
    if (mesh.material) mesh.material.color.set(hex);
  }

  duplicate(mesh) {
    return this.sm.duplicateObject(mesh);
  }

  remove(mesh) {
    this.sm.removeObject(mesh);
  }
}