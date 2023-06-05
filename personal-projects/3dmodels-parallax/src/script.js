import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//axes helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
let modelRotation = { x: 0, y: 0, z: 0 } // Object to store rotation value
let gltfScene;
const objectsDistance = 2

gltfLoader.load(
    './models/m4/scene.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(0.07, 0.07, 0.07)

        gltf.scene.position.y = 1;
        gltf.scene.position.x = 0.5;

        gltf.scene.rotation.reorder('YXZ')
        gltf.scene.rotation.x = Math.PI * -0.2;
        gltf.scene.rotation.y = Math.PI * 0.8;
        gltf.scene.rotation.z = Math.PI * -0.105;

        scene.add(gltf.scene)

        gltfScene = gltf.scene;
        // console.log(gltfScene)
        // Animation
        // mixer = new THREE.AnimationMixer(gltf.scene)
        // const action = mixer.clipAction(gltf.animations[2])
        // action.play()
    }
)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 10.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 10.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Mouse
 */
/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    // if(mixer)
    // {
    //     mixer.update(deltaTime)
    // }
    if (gltfScene) {
        gltfScene.rotation.z = Math.cos(elapsedTime * 0.9) * Math.PI * 0.18
    }

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x
    const parallaxY = cursor.y
    camera.position.x = 2 + parallaxX
    camera.position.y = 2 + parallaxY

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
