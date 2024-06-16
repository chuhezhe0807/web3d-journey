import { AccumulativeShadows, Center, Decal, Environment, RandomizedLight, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { ReactNode, useRef } from "react";
import { Group, Vector3 } from "three";
import { easing } from "maath";

import StoreWrapper from "./UIWrapper";
import { RootState } from "./Store";

/**
 * ConfiguratorUI
 * <Canvas gl={{preserveDrawingBuffer: true}}> 
 * preserveDrawingBuffer -是否保留缓直到手动清除或被覆盖。 默认false. 
 * 主要用于利用 Canvas.toDataURL("image.png") 保存渲染结果为图片
 * @see https://threejs.org/docs/index.html?q=renderer#api/zh/renderers/WebGLRenderer
 * @returns 
 */
export default function ConfiguratorUI() {
    const position = new Vector3(0, 0, 0.25);
    const fov = 25;

    return (
        <StoreWrapper>
          <Canvas shadows camera={{position, fov}} gl={{preserveDrawingBuffer: true}} eventSource={document.getElementById('root')!} eventPrefix="client">
            <ambientLight intensity={0.5} />
            <Environment files="/textures/hdrs/configurator.hdr"/>
            <CameraRig>
              <RenderBackdrop />
              <Center>
                <RenderShirt />
              </Center>
            </CameraRig>
          </Canvas>
        </StoreWrapper>
    )
}

/**
 * 渲染Shirt
 */
function RenderShirt(props: any) {
    const decal = useSelector((state: RootState) => state.decal);
    const color = useSelector((state: RootState) => state.color);
    const texture = useTexture(`/textures/uv/${decal}.png`);
    const {nodes, materials} = useGLTF("/models/TShirtConfigurator/shirt_baked_collapsed.glb");

    useFrame((_, delta) => {
        easing.dampC((materials.lambert1 as any).color, color, 0.25, delta);
    })

    return (
      <mesh 
        castShadow 
        material={materials.lambert1}
        geometry={(nodes.T_Shirt_male as any).geometry} 
        material-roughness={1} 
        {...props} 
        dispose={null}
        scale={0.15}
      >
        <Decal position={[0, 0.04, 0.15]} rotation={[0, 0, 0]} scale={0.15} map={texture} />
      </mesh>
    );
}

/**
 * 渲染背景
 * AccumulativeShadows A planar, Y-up oriented shadow-catcher that can accumulate into soft shadows and 
 *  has zero performance impact after all frames have accumulated. 
 * You must pair it with lightsources (and scene objects!) that cast shadows, which go into the children 
 *  slot. Best use it with the RandomizedLight component, which jiggles a set of lights around, 
 *  creating realistic raycast-like shadows and ambient occlusion.
 * @returns 
 */
function RenderBackdrop() {
    const shadows = useRef<any>();
    useFrame((state, delta) => easing.dampC(shadows.current!.getMesh().material.color, (state as any).color, 0.25, delta));

    return (
        <AccumulativeShadows ref={shadows} temporal frames={60} alphaTest={0.85} scale={10} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.14]}>
            <RandomizedLight amount={4} radius={9} intensity={0.55} ambient={0.25} position={[5, 5, -10]} />
            <RandomizedLight amount={4} radius={5} intensity={0.25} ambient={0.55} position={[-5, 5, -9]} />
        </AccumulativeShadows>
    )
}

/**
 * 相机部分
 */
function CameraRig({children}: {children: ReactNode}) {
    const groupRef = useRef<Group>(null);

    useFrame(({pointer: {x, y}}, delta) => {
        easing.dampE(groupRef.current!.rotation, [y / 10, -x / 5, 0], 0.25, delta);
    })

    return (
        <group ref={groupRef}>{children}</group>
    )
}

// preload.
useGLTF.preload("/models/TShirtConfigurator/shirt_baked_collapsed.glb");
['react', 'three2', 'pmndrs'].forEach(useTexture.preload);