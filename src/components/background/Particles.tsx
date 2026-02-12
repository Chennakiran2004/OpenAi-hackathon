import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COLOR = '#00C896';
const OPACITY = 0.07;
const SIZE = 1.5;
const BOX_SIZE = 280;

export default function Particles() {
  const count = useMemo(() => {
    if (typeof window === 'undefined') return 200;
    return window.innerWidth < 768 ? 120 : 280;
  }, []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * BOX_SIZE;
      arr[i * 3 + 1] = (Math.random() - 0.5) * BOX_SIZE;
      arr[i * 3 + 2] = (Math.random() - 0.5) * (BOX_SIZE * 0.6);
    }
    return arr;
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: COLOR,
        size: SIZE,
        transparent: true,
        opacity: OPACITY,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = Math.sin(t * 0.08) * 0.04;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
