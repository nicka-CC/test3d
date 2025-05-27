import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { useThree, useFrame, Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { ARButton, XR, Controllers, Hands, useXR } from "@react-three/xr";

import { DefaultCube } from "./DefaultCube";

function ARScene() {
    const { isPresenting } = useXR();
    
    return (
        <Canvas 
            camera={{ position: [0, 1.5, 4], fov: 75 }}
            shadows
        >
            <color attach="background" args={["#f0f0f0"]} />
            <fog attach="fog" args={["#f0f0f0", 5, 20]} />
            
            <ambientLight intensity={0.8} />
            <directionalLight 
                position={[10, 10, 5]} 
                intensity={1} 
                castShadow 
                shadow-mapSize={[1024, 1024]}
            />
            
            <Environment preset="sunset" />
            <Controllers />
            <Hands />
            <DefaultCube />
        </Canvas>
    );
}

export default function App() {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-ar')
                .then((supported) => {
                    setIsSupported(supported);
                });
        }
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {isSupported ? (
                <>
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        zIndex: 1000,
                        padding: '10px',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        borderRadius: '5px'
                    }}>
                        <ARButton />
                    </div>
                    <XR>
                        <ARScene />
                    </XR>
                </>
            ) : (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    fontSize: '24px',
                    color: 'red'
                }}>
                    Ваш браузер не поддерживает AR
                </div>
            )}
        </div>
    );
}
