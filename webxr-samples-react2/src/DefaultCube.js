import React from "react";
export function DefaultCube() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="gray" />
        </mesh>
);
}
