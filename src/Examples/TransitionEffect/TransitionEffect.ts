import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    Texture,
    Color,
    AmbientLight,
} from "three";
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { WorldBaseWorkflow } from "../../Common/Interface/WorldBase";

export default class TransitionEffect implements WorldBaseWorkflow {
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    controls: OrbitControls;
    stats: Stats;
    texture?: Texture

    constructor(private canvas: HTMLCanvasElement) {
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({canvas, antialias: true});
        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.stats = new Stats();
        this.controls = new OrbitControls(this.camera, this.canvas);

        this.init();
        this.onRender();
    }

    init() {
        const ambientLight = new AmbientLight(0xffffff, 2)
        this.camera.position.set(5, 5, 5);
        
        this.controls.enableDamping = true;
        document.body.appendChild(this.stats.dom);
        
        this.scene.add(ambientLight);
        this.scene.background = new Color("skyblue");

        this.loadModel();
    }

    async loadModel() {
        const loader = new GLTFLoader();
        const model = await loader.loadAsync("/models/little-house01.glb");

        this.scene.add(model.scene);
    }

    onRender() {
        const {scene, camera, stats, renderer} = this;
        renderer.setAnimationLoop(animate);

        function animate() {
            stats.update();
            renderer.render(scene, camera);
        }
    }

    onDispose() {

    }
}