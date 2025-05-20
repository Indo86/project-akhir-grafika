import * as THREE from 'three'
import { OrbitControls } from 'three-stdlib'
import { makeObject } from './ObjectFactory.js'

export default class SceneManager {
  constructor(container) {
    this.scene    = new THREE.Scene()
    this.camera   = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000)
    this.camera.position.set(0,2,5)
    this.renderer = new THREE.WebGLRenderer({ antialias:true })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const dir = new THREE.DirectionalLight(0xffffff,1)
    dir.position.set(5,10,7.5)
    this.scene.add(dir)

    // Tambahkan AxesHelper (sumbu X, Y, Z)
    this.fullAxes = this._createFullAxes(5)
    this.scene.add(this.fullAxes)

    this.enableRotation = true
    this.rotationSpeed = 0.01

    this.objects = []
    this.counts  = {}  // untuk hitung berapa instance tiap tipe
    this.revolvers = []; 
    this.animate = this.animate.bind(this)
  }

  addObject(type, material, options) {
    // auto nama unik: e.g. 'Box 1', 'Box 2', ...
    this.counts[type] = (this.counts[type]||0) + 1
    const mesh = makeObject(type, material, options)
    mesh.name = `${type} ${this.counts[type]}`
    this.scene.add(mesh)
    this.objects.push(mesh)
    return mesh
  }

  removeObject(mesh) {
    this.scene.remove(mesh)
    this.objects = this.objects.filter(o=>o!==mesh)
    mesh.geometry.dispose()
    mesh.material.dispose?.()
  }

  duplicateObject(mesh) {
    const clone = mesh.clone()
    clone.material = mesh.material.clone()
    // assign new name
    const type = mesh.name.split(' ')[0]
    this.counts[type] = (this.counts[type]||0) + 1
    clone.name = `${type} ${this.counts[type]}`
    this.scene.add(clone)
    this.objects.push(clone)
    return clone
  }

  setPosition(mesh, pos)  { mesh.position.set(pos.x,pos.y,pos.z) }
  setRotation(mesh, rot)  { mesh.rotation.set(rot.x,rot.y,rot.z) }
  setScale(mesh, sc)      { mesh.scale.set(sc.x,sc.y,sc.z) }
  setColor(mesh, hex)     { mesh.material.color.set(hex) }

  // helper untuk membuat 6 garis sumbu:
  _createFullAxes(length) {
    const axes = new THREE.Group()
    const build = (start, end, color) => {
      const mat = new THREE.LineBasicMaterial({ color })
      const pts = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      axes.add(new THREE.Line(geo, mat))
    }

    // X+ merah, X– marun
    build([0,0,0], [ length,0,0], 0xff0000)
    build([0,0,0], [-length,0,0], 0x800000)
    // Y+ hijau, Y– gelap
    build([0,0,0], [0, length,0], 0x00ff00)
    build([0,0,0], [0,-length,0], 0x008000)
    // Z+ biru, Z– gelap
    build([0,0,0], [0,0, length], 0x0000ff)
    build([0,0,0], [0,0,-length], 0x000080)

    return axes
  }

  // toggle visibility seluruh axes
  toggleAxes(show) {
    this.fullAxes.visible = show
  }


  toggleRotation(enable) {
    this.enableRotation = enable
  }

    // tambahkan ini setelah method toggleRotation
    toggleRevolution(mesh, enable) {
      // kalau enable, start revolusi
      if (enable) {
        // hindari duplikat
        if (!this.revolvers.find(r => r.mesh === mesh)) {
          this.revolvers.push({
            mesh,
            centerX: 0, centerZ: 0,
            radius: 3,      // ubah sesuai kebutuhan
            speed: 0.02,
            angle: 0
          })
        }
      } else {
        // hapus revolver utk mesh ini
        this.revolvers = this.revolvers.filter(r => r.mesh !== mesh)
        // (opsional) reset posisi mesh ke (0,0,0) atau biarkan posisi terakhir
      }
    }
  start() { this.animate() }

  animate() {
    requestAnimationFrame(this.animate)
    this.controls.update()

    // Rotasi otomatis jika diaktifkan
    if (this.enableRotation) {
      this.objects.forEach(obj => {
        obj.rotation.y += this.rotationSpeed
      })
    }

    this.revolvers.forEach(r => {
      r.angle += r.speed
      r.mesh.position.x = r.centerX + Math.cos(r.angle) * r.radius
      r.mesh.position.z = r.centerZ + Math.sin(r.angle) * r.radius
    })


    this.renderer.render(this.scene, this.camera)
  }
}