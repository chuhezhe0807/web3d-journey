import {DoubleSide, Vector3} from "three";
import {Canvas, extend, useFrame, useThree} from "@react-three/fiber";
import {CameraControls, Gltf, MeshPortalMaterial, Preload, Text, useCursor} from "@react-three/drei";
import { useMatch, useNavigate } from "react-router-dom";
import {easing, geometry} from "maath";
import { ReactNode, useEffect, useRef, useState } from "react";
import { suspend } from "suspend-react";

import RouteWrapper from "./RouteWrapperUI";

extend(geometry);
const regular = import('@pmndrs/assets/fonts/inter_regular.woff');
const medium = import('@pmndrs/assets/fonts/inter_medium.woff');

type RenderModelProps = {
  children: ReactNode;
  backgroundColor?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
} & {[key in "id" | "name" | "author"]: string;}

export default function EnterPortalUI() {

  return <RouteWrapper>
    <Canvas camera={{fov: 75, position: [0, 0, 20]}} eventSource={document.getElementById("root")!} eventPrefix="client">
      {/* <color /> 为react-three的属性组件，同 <group /> */}
      <color attach="background" args={['#f0f0f0']} />
      <RenderModelPortal id="01" name={`pick\nles`} author="Omar Faruq Tawsif" backgroundColor="#e4cdac" position={[-1.15, 0, 0]} rotation={[0, 0.5, 0]}>
        <Gltf src="/models/painting01.glb" position={[0, -2, -3]} />
      </RenderModelPortal>
      <RenderModelPortal id="02" name={`tea`} author="Omar Faruq Tawsif">
        <Gltf src="/models/painting02.glb" scale={8} position={[0, -0.7, -2]} />
      </RenderModelPortal>
      <RenderModelPortal id="03" name={`still`} author="Omar Faruq Tawsif" backgroundColor="#d1d1ca" position={[1.15, 0, 0]} rotation={[0, -0.5, 0]}>
        <Gltf src="/models/painting03.glb" scale={2} position={[0, -0.7, -2]} />
      </RenderModelPortal>
      <CameraControl />
      <Preload all />
    </Canvas>
  </RouteWrapper>
}

/**
 * 渲染模型的组件
 */
function RenderModelPortal({id, author, name, backgroundColor, children, ...otherProps}: RenderModelProps) {
  const width = 1;
  const height = 1.61803398875;
  const navigate = useNavigate();
  const {params} = useMatch("/item/:id") || {};
  const portal = useRef<any>();
  const [hovered, setHovered] = useState<boolean>(false);

  useCursor(hovered);
  useFrame((state, delta) => {
    /**
     * MeshPortalMaterial 的 props
     * Mix the portals own scene with the world scene, 0 = world scene render,
     * 0.5 = both scenes render, 1 = portal scene renders, defaults to 0
     */
    easing.damp(portal.current, 'blend', params?.id === id ? 1 : 0, 0.2, delta)
  });

  return <group {...otherProps}>
    <Text font={(suspend(medium) as any).default} fontSize={0.3} anchorY="top" anchorX="left" lineHeight={0.8} position={[-0.375, 0.715, 0.01]} material-toneMapped={false}>
      {name}
    </Text>
    <Text font={(suspend(regular) as any).default} fontSize={0.1} anchorX="right" position={[0.4, -0.659, 0.01]} material-toneMapped={false}>
        /{id}
    </Text>
    <Text font={(suspend(regular) as any).default} fontSize={0.04} anchorX="right" position={[0.0, -0.677, 0.01]} material-toneMapped={false}>
      {author}
    </Text>
    <mesh
      name={id}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onDoubleClick={(e) => (e.stopPropagation(), navigate(`/item/${id}`))}
    >
      <roundedPlaneGeometry args={[width, height, 0.1]} />
      <MeshPortalMaterial ref={portal} events={params?.id === id} side={DoubleSide}>
        <color attach={"background"} args={[backgroundColor ?? ""]} />
        {children}
      </MeshPortalMaterial>
    </mesh>
  </group>
}

/**
 * camera 控制组件
 */
function CameraControl() {
  const focus = new Vector3(0, 0, 0);
  const position = new Vector3(0, 0, 2);
  const {controls, scene} = useThree();
  const {params} = useMatch("/item/:id") || {};
  const navigate = useNavigate();
  
  useEffect(() => {
    const active = scene.getObjectByName(params?.id!);

    if(active) {
      active.parent?.localToWorld(position.set(0, 0.5, 0.25));
      active.parent?.localToWorld(focus.set(0, 0, -2));
    }

    (controls as any)?.setLookAt && (controls as any)?.setLookAt(...position.toArray(), ...focus.toArray(), true);
  }, [navigate, controls]);

  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
}