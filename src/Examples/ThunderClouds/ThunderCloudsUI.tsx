import { Cloud, Clouds, ContactShadows, Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { BackSide, Vector3 } from "three";
import {RigidBody, BallCollider, Physics, CuboidCollider} from "@react-three/rapier";
import type {ContactForcePayload} from "@react-three/rapier";
import { useRef, useState } from "react";
import { random } from "maath";

export default function ThunderCloudsUI() {

    return (
        <Canvas >
            <ambientLight intensity={Math.PI / 2} />  
            <PerspectiveCamera makeDefault position={[0, -4, 18]} fov={90} onUpdate={(self) => self.lookAt(0, 0, 0)}>
                <spotLight position={[0, 40, 2]} angle={0.5} decay={1} distance={45} penumbra={1} intensity={2000} />
                <spotLight position={[-19, 0, -8]} color="red" angle={0.25} decay={0.75} distance={185} penumbra={-1} intensity={400} />
            </PerspectiveCamera>    
            {/** limit Maximum number of segments, default: 200 */}
            {/** material Which material it will override, default: MeshLambertMaterial */}
            <Clouds texture="/pics/clouds/cloud.png" limit={400}>
                <Physics gravity={[0, 0, 0]}>
                    {/* <Pointer /> */}
                    <PuffyCloud seed={10} position={[50, 0, 0]} />
                    <PuffyCloud seed={20} position={[0, 50, 0]} />
                    {/* <PuffyCloud seed={30} position={[50, 0, 50]} />
                    <PuffyCloud seed={40} position={[0, 0, -50]} /> */}
                    <CuboidCollider position={[0, -15, 0]} args={[400, 10, 400]} />
                </Physics>
            </Clouds>
            <mesh scale={200}>
                <sphereGeometry />
                <meshStandardMaterial color="#999" roughness={0.7} side={BackSide} />
            </mesh>
            <ContactShadows opacity={0.25} color="black" position={[0, -10, 0]} scale={50} blur={2.5} far={40} />
            <OrbitControls makeDefault autoRotate enableZoom={true} enablePan={false} minPolarAngle={Math.PI / 1.7} maxPolarAngle={Math.PI / 1.7} />
            <Environment files="/textures/hdrs/blue_lagoon_night_1k.hdr" /> 
        </Canvas>
    )
}

function PuffyCloud({seed, position}: {seed: number, position: [number, number, number]}) {
    const vec3 = new Vector3();
    const rigidBodyRef = useRef<any>();
    const lightRef = useRef<any>();
    // 使用 useState(initialValue) 可以保证 initialValue 仅会被执行一次，可以用来做一些expensive的事情
    const [flash] = useState(() => new random.FlashGen({count: 10, minDuration: 40, maxDuration: 200}));
    const concat = (payload: ContactForcePayload) => payload.other.rigidBodyObject?.userData?.cloud &&
        payload.totalForceMagnitude / 1000 > 100 && flash.burst();

    useFrame((state, delta) => {
        const impulse = flash.update(state.clock.elapsedTime, delta);
        lightRef.current.intensity = impulse * 15000;
        rigidBodyRef.current?.applyImpulse(vec3.copy(rigidBodyRef.current.translation()).negate().multiplyScalar(10));
    });

    return (
        <RigidBody 
            ref={rigidBodyRef} 
            userData={{cloud: true}} 
            onContactForce={concat}
            linearDamping={4}
            angularDamping={1}
            friction={0.1}
            position={position}
            colliders={false}
        >
            <BallCollider args={[4]} />
            <Cloud seed={seed} fade={30} speed={0.1} growth={4} segments={40} volume={6} opacity={0.6} bounds={[4, 3, 1]} />
            <Cloud seed={seed + 1} fade={30} position={[0, 1, 0]} speed={0.5} growth={4} volume={10} opacity={1} bounds={[6, 2, 1]} />
            <pointLight position={[0, 0, 0.5]} ref={lightRef} color={"blue"} />
        </RigidBody>
    )
}