import React from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ARCanvas } from "@react-three/xr";

import { DefaultCube } from "./DefaultCube";

export default function App() {
    return (
        <ARCanvas camera={{ position: [0, 1.5, 4] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <DefaultCube />
        </ARCanvas>
    );
}
