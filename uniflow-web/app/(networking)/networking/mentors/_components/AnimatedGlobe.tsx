"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";

function NetworkGlobe() {
  const globeRef = useRef<THREE.Group>(null);
  
  // Create a highly detailed icosahedron geometry for the network wireframe and nodes
  const { geometry, points } = useMemo(() => {
    // A geodesic sphere-like geometry creates that realistic triangle network look
    const geo = new THREE.IcosahedronGeometry(1.4, 4); 
    
    // Create random particles floating around the globe
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const rand = 1.4 + Math.random() * 0.3; // slightly outside and inside the wireframe
        
        positions[i * 3] = rand * Math.sin(phi) * Math.cos(theta); // x
        positions[i * 3 + 1] = rand * Math.sin(phi) * Math.sin(theta); // y
        positions[i * 3 + 2] = rand * Math.cos(phi); // z
    }
    
    return { geometry: geo, points: positions };
  }, []);

  useFrame(({ clock }) => {
    if (globeRef.current) {
      // Gentle rotation matching a realistic floating globe
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      globeRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Dark inner core sphere to occlude deep back-facing lines and give volume */}
      <Sphere args={[1.38, 32, 32]}>
        <meshBasicMaterial color="#07101d" transparent opacity={0.9} />
      </Sphere>

      {/* Network wireframe mimicking the connecting lines */}
      <mesh geometry={geometry}>
        <meshBasicMaterial 
          color="#2e6c84" 
          wireframe 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Glowing nodes exactly on the vertices of the network */}
      <points geometry={geometry}>
        <pointsMaterial 
          size={0.03} 
          color="#6ce9f8" 
          transparent 
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Additional scattered glowing data particles */}
      <Points positions={points}>
        <PointMaterial 
          transparent 
          color="#a9fbff" 
          size={0.015} 
          sizeAttenuation 
          depthWrite={false} 
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export function AnimatedGlobe() {
  return (
    <div className="relative flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(108,233,248,0.15)_0%,rgba(11,26,48,0.05)_50%,transparent_75%)] blur-2xl pointer-events-none" />
      <div className="relative h-full w-full">
        {/* We use Three.js canvas to render a true 3D spatial network globe */}
        <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#a9fbff" />
          <NetworkGlobe />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.8} 
          />
        </Canvas>
      </div>
    </div>
  );
}
