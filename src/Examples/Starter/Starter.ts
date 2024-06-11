import {
    Mesh,
    Scene,
    BoxGeometry,
    WebGLRenderer,
    PerspectiveCamera,
    DirectionalLight,
    MeshStandardMaterial,
    DirectionalLightHelper,
    AxesHelper,
    Color,
    TextureLoader,
    Texture,
} from "three";
import Stats from 'three/addons/libs/stats.module.js';
import { Timer } from "three/examples/jsm/Addons.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import AbsWorld from "../../Common/AbsWorld";

/**
 * Starter.
 */
export default class Starter extends AbsWorld {
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    canvas: HTMLCanvasElement;
    controls: OrbitControls;
    stats: Stats;
    timer: Timer;
    directionalLight: DirectionalLight;
    directionalLightHelper: DirectionalLightHelper;
    axesHelper: AxesHelper;
    cube: Mesh;
    texture?: Texture

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({canvas, antialias: true});
        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.stats = new Stats();
        this.timer = new Timer();
        this.controls = new OrbitControls(this.camera, canvas);
        this.directionalLight = new DirectionalLight("white", 8);
        this.directionalLightHelper = new DirectionalLightHelper(this.directionalLight, 1, "gray");
        this.axesHelper = new AxesHelper(2);
        this.cube = this.getCube();

        this.init();
        this.onRender();
    }

    /**
     * @override
     */
    init() {
        super.init();

        this.scene.background = new Color("skyblue");
        
        this.camera.position.set(5, 5, 5);
        this.directionalLight.position.set(2, 2, 2);
        this.directionalLight.target.position.set(1, 1, 1);
        
        this.controls.enableDamping = true;
        document.body.appendChild(this.stats.dom);

        this.scene.add(
            this.directionalLight, 
            this.directionalLight.target, 
            this.directionalLightHelper, 
            this.axesHelper,
            this.cube
        );
    }

    /**
     * @override
     */
    doSomethingOnRender = (timeStamp: number) => {
        this.stats.update();
        this.timer.update(timeStamp); // 更新定时器的内部状态。该方法应该在每个模拟步骤以及对计时器执行查询之前调用一次（例如通过 .getDelta()）。
        this.controls.update();
        this.directionalLightHelper.update();

        const delta = this.timer.getDelta(); // 返回以秒为单位的时间增量。
        this.cube.rotation.y += delta * Math.PI / 6;
    }

    /**
     * @override
     */
    onDispose() {
        this.timer.dispose();
        this.texture?.dispose();
        this.axesHelper.dispose();
        this.directionalLightHelper.dispose();
    }

    /**
     * @override
     */
    onResize() {

    }

    loadTexture() {
        const textureLoad = new TextureLoader();

        // 调用load方法后，会直接返回一个空的Texture对象，在物体上看是黑色的，知道纹理加载完成
        return textureLoad.load(
            "/textures/uv/uv-cube-bw.jpg",
            (e) => {
                console.log(e);
            },
            (e) => {
                console.log(e);
            }
        );
    }

    getCube() {
        const texture = this.loadTexture();
        const geometry = new BoxGeometry(1, 1, 1);
        // MeshBasicMaterial 会忽略光照
        // const material = new MeshBasicMaterial({color: 0x00ff00 });
        // MeshStandardMaterial 的color和map不要同时设置，color会影响map的效果
        const material = new MeshStandardMaterial({map: texture });
        const cube = new Mesh(geometry, material);
        this.texture = texture;

        return cube;
    }
}