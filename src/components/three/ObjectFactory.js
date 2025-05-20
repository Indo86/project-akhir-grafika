// Import objek parametrik dari folder objects/
import { createTorusKnot }  from './objects/torusKnot.js'
import { createNonagon }    from './objects/nonagon.js'
import { createMobiusStrip }from './objects/mobiusStrip.js'
import { createKleinBottle }from './objects/kleinBottle.js'

export const FACTORIES = {
  torusKnot:  createTorusKnot,
  nonagon:    createNonagon,
  mobiusStrip:createMobiusStrip,
  kleinBottle:createKleinBottle
}

/**
 * type: key pada FACTORIES ('box', 'sphere', 'torus', dsb.)
 * material: THREE.Material
 * options: object-specific params (misal scale, segments)
 */
export function makeObject(type, material, options) {
  const fn = FACTORIES[type]
  return fn ? fn(material, options) : null
}
