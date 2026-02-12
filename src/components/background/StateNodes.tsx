import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getCentroids } from './geo';
import type { GeoFeature } from './geo';

const NODE_COLOR = '#062D2E';
const EMISSIVE = '#00C896';
const RADIUS = 1.2;

type StateNodesProps = {
  features: GeoFeature[];
};

export default function StateNodes({ features }: StateNodesProps) {
  const centroids = React.useMemo(() => getCentroids(features), [features]);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const scale = 1 + Math.sin(t * 1.2 + i * 0.5) * 0.08;
      child.scale.setScalar(scale);
    });
  });

  return (
    <group ref={groupRef}>
      {centroids.map(([x, y, z], idx) => (
        <mesh key={`node-${idx}`} position={[x, y, z]}>
          <sphereGeometry args={[RADIUS, 16, 16]} />
          <meshStandardMaterial
            color={NODE_COLOR}
            emissive={EMISSIVE}
            emissiveIntensity={1.2}
          />
        </mesh>
      ))}
    </group>
  );
}
