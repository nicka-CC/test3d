import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export function DefaultCube() {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5;
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <mesh
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            position={[0, 1, -2]}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
                color={hovered ? "hotpink" : "orange"} 
                metalness={0.5}
                roughness={0.2}
            />
        </mesh>
    );
}
