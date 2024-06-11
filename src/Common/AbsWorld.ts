import {
    Camera, 
    PerspectiveCamera,
    Scene,
    OrthographicCamera,
    WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Timer } from "three/examples/jsm/Addons.js";
import { Updatable } from "./Interface/Updatable";

export function isPerspectiveCamera(camera: Camera): camera is PerspectiveCamera {
    return camera instanceof PerspectiveCamera;
}

/**
 * 场景类
 */
export default abstract class AbsWorld implements Updatable {
    protected abstract scene: Scene;
    protected abstract camera: PerspectiveCamera | OrthographicCamera;
    protected abstract renderer: WebGLRenderer;
    protected abstract controls: OrbitControls;
    protected abstract canvas: HTMLCanvasElement;
    protected abstract timer: Timer;

    protected abstract doSomethingOnRender(timeStamp: number): void;
    protected abstract onResize(): void;
    protected abstract onDispose(): void;

    public static WINDOW_INNER_SIZES = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    init() {
        this.scene.add(this.camera);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearAlpha(0.1);

        window.addEventListener("resize", () => update.apply(this));

        function update(this: AbsWorld) {
            // Update sizes
            AbsWorld.WINDOW_INNER_SIZES.width = window.innerWidth;
            AbsWorld.WINDOW_INNER_SIZES.height = window.innerHeight;
            
            // Update camera
            if(isPerspectiveCamera(this.camera)) {
                this.camera.aspect = AbsWorld.WINDOW_INNER_SIZES.width / AbsWorld.WINDOW_INNER_SIZES.height;
            }
            this.camera.updateProjectionMatrix();

            this.onResize();
            
            // Update renderer
            this.renderer.setSize(AbsWorld.WINDOW_INNER_SIZES.width, AbsWorld.WINDOW_INNER_SIZES.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }

    /**
     * @implements
     */
    onRender() {
        const {scene, camera, renderer, doSomethingOnRender} = this;

        // 如果场景是静态的并使用OrbitControls相机，可以监听控件的change 事件,
        // 这样就可以只在相机移动时渲染场景：
        // this.controls.addEventListener("change", () => {
        //     // do something.
        //     doSomethingOnRender(1);
        //     renderer.render(scene, camera);
        // })

        renderer.setAnimationLoop(animate);

        function animate(timeStamp: number) {
            // do something.
            doSomethingOnRender(timeStamp);
            renderer.render(scene, camera);
        }
    }
}