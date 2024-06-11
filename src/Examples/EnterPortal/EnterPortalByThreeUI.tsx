import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    AmbientLight,
    Color,
    PlaneGeometry,
    WebGLRenderTarget,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Vector3,
} from "three";
import Stats from 'three/addons/libs/stats.module.js';
import { CameraUtils, DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useEffect, useRef } from "react";

import RouteWrapperUI from "./RouteWrapperUI";
import { WorldBaseWorkflow } from "../../Common/Interface/WorldBase";
import { isPerspectiveCamera } from "../../Common/Common";

const WINDOW_INNER_SIZES = {
    width: window.innerWidth,
    height: window.innerHeight
}

export default function EnterPortalByThreeUI() {
    const enterPortalRef = useRef<EnterPortalByThree | null>();

    useEffect(() => {
        if(!enterPortalRef.current) {
            enterPortalRef.current = new EnterPortalByThree();
        }

        return () => {
            enterPortalRef.current?.onDispose();
        }
    }, []);

    return <RouteWrapperUI>
        <canvas id="enter-portal-canvas"></canvas>
    </RouteWrapperUI>;
}

class EnterPortalByThree implements WorldBaseWorkflow {
    scene: Scene;
    camera: PerspectiveCamera;
    portalCamera: PerspectiveCamera;
    renderer: WebGLRenderer;
    controls: OrbitControls;
    stats: Stats;
    reflectedPosition: Vector3;
    planeGeo: PlaneGeometry;
    portalTexture: WebGLRenderTarget;
    portalMesh: Mesh;

    constructor() {
        const canvas = document.getElementById("enter-portal-canvas");

        this.scene = new Scene();
        this.renderer = new WebGLRenderer({canvas: canvas!, antialias: true});
        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.portalCamera = new PerspectiveCamera( 45, 1.0, 0.1, 500.0 );
        this.stats = new Stats();
        this.controls = new OrbitControls(this.camera, canvas!);

        this.reflectedPosition = new Vector3();
        this.planeGeo = new PlaneGeometry( 5, 5 );
        this.portalTexture = new WebGLRenderTarget( 256, 256 );
        this.portalMesh = new Mesh( this.planeGeo, new MeshBasicMaterial( { map: this.portalTexture.texture } ) );

        // Not yet implemented. 😔
        // this.init();
        // this.renderPortal();
        // this.onRender();
    }

    init(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearAlpha(0.1);

        // this.loadModel();
        this.camera.position.set( 0, 3.75, 8 );
        this.controls.enableDamping = true;
        document.body.appendChild(this.stats.dom);

        this.scene.background = new Color("#f0f0f0");
        this.scene.add(this.camera, new AmbientLight(0xffffff, 0.8));

        window.addEventListener("resize", () => {
            // Update sizes
            WINDOW_INNER_SIZES.width = window.innerWidth;
            WINDOW_INNER_SIZES.height = window.innerHeight;
            
            // Update camera
            if(isPerspectiveCamera(this.camera)) {
                this.camera.aspect = WINDOW_INNER_SIZES.width / WINDOW_INNER_SIZES.height;
            }
            this.camera.updateProjectionMatrix();
            
            // Update renderer
            this.renderer.setSize(WINDOW_INNER_SIZES.width, WINDOW_INNER_SIZES.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    async loadModel() {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        loader.setDRACOLoader(dracoLoader);
        const model = await loader.loadAsync("/models/painting01.glb");

        this.scene.add(model.scene);
    }

    renderPortal() {
        this.scene.add( this.portalMesh, this.portalCamera );
        this.renderWalls();
    }

    renderWalls() {
        const planeGeo = this.planeGeo;
        // walls
        const planeTop = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xffffff } ) );
        planeTop.position.y = 5;
        planeTop.rotateX( Math.PI / 2 );
        this.scene.add( planeTop );

        const planeBottom = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xffffff } ) );
        planeBottom.rotateX( - Math.PI / 2 );
        this.scene.add( planeBottom );

        const planeFront = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0x7f7fff } ) );
        planeFront.position.z = 2.5;
        planeFront.position.y = 2.5;
        planeFront.rotateY( Math.PI );
        this.scene.add( planeFront );

        const planeBack = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xff7fff } ) );
        planeBack.position.z = -2.5;
        planeBack.position.y = 2.5;
        //planeBack.rotateY( Math.PI );
        this.scene.add( planeBack );

        const planeRight = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0x00ff00 } ) );
        planeRight.position.x = 2.5;
        planeRight.position.y = 2.5;
        planeRight.rotateY( - Math.PI / 2 );
        this.scene.add( planeRight );

        const planeLeft = new Mesh( planeGeo, new MeshPhongMaterial( { color: 0xff0000 } ) );
        planeLeft.position.x = -2.5;
        planeLeft.position.y = 2.5;
        planeLeft.rotateY( Math.PI / 2 );
        this.scene.add( planeLeft );
    }

    updatePortal( portalMesh: Mesh, portalTexture: WebGLRenderTarget, camera: PerspectiveCamera, 
        portalCamera: PerspectiveCamera, reflectedPosition: Vector3, renderer: WebGLRenderer, scene: Scene) {
        // set the portal camera position to be reflected about the portal plane
        portalMesh.worldToLocal( reflectedPosition.copy( camera.position ) );
        reflectedPosition.x *= - 1.0; 
        reflectedPosition.z *= - 1.0;
        portalCamera.position.copy( reflectedPosition );
        // grab the corners of the other portal
        // - note: the portal is viewed backwards; flip the left/right coordinates
        // otherPortalMesh.localToWorld( bottomLeftCorner.set( 50.05, - 50.05, 0.0 ) );
        // otherPortalMesh.localToWorld( bottomRightCorner.set( - 50.05, - 50.05, 0.0 ) );
        // otherPortalMesh.localToWorld( topLeftCorner.set( 50.05, 50.05, 0.0 ) );
        // // set the projection matrix to encompass the portal's frame
        // CameraUtils.frameCorners( portalCamera, bottomLeftCorner, bottomRightCorner, topLeftCorner, false );

        // render the portal
        portalTexture.texture.colorSpace = renderer.outputColorSpace;
        renderer.setRenderTarget( portalTexture );
        renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897
        if ( renderer.autoClear === false ) renderer.clear();
        portalMesh.visible = false; // hide this portal from its own rendering
        renderer.render( scene, portalCamera );
        portalMesh.visible = true; // re-enable this portal's visibility for general rendering
    }

    onRender(): void {
        const {scene, camera, renderer, stats, controls, portalMesh, portalTexture, portalCamera,
            reflectedPosition, updatePortal} = this;

        renderer.setAnimationLoop(animate);

        function animate() {
            stats.update();
            controls.update();
            updatePortal(portalMesh, portalTexture, camera, portalCamera, reflectedPosition, renderer, scene);

            renderer.render(scene, camera);
        }
    }

    onDispose(): void {
        
    }
}