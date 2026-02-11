import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import type { SVGResult } from 'three/examples/jsm/loaders/SVGLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// OrbitControls without drei (local minimal wrapper)
function OrbitControlsMinimal() {
  const { camera, gl } = useThree();
  const controls = useRef<OrbitControls | null>(null);

  useEffect(() => {
    controls.current = new OrbitControls(camera, gl.domElement);
    controls.current.enableZoom = false;
    controls.current.autoRotate = true;
    controls.current.autoRotateSpeed = 0.6;
    controls.current.enablePan = false;
    return () => controls.current?.dispose();
  }, [camera, gl]);

  useFrame(() => {
    controls.current?.update();
  });

  return null;
}

function IndiaOutline() {
  const svgData = useLoader(SVGLoader, '/india.svg') as SVGResult;
  const paths = svgData.paths as unknown as any[];

  const lines = useMemo(() => {
    const geoms: THREE.BufferGeometry[] = [];

    const makeGeometry = (pts: { x: number; y: number }[]) => {
      const vecs = pts.map((p) => new THREE.Vector3(p.x, -p.y, 0));
      const geom = new THREE.BufferGeometry().setFromPoints(vecs);
      geom.computeBoundingBox();
      const box = geom.boundingBox;
      if (box) {
        const offsetX = (box.max.x + box.min.x) / 2;
        const offsetY = (box.max.y + box.min.y) / 2;
        geom.translate(-offsetX, -offsetY, 0);
      }
      return geom;
    };

    paths.forEach((path) => {
      // subPaths (strokes)
      (path.subPaths || []).forEach((sub: any) => {
        const pts = sub.getPoints ? sub.getPoints(200) : [];
        if (pts.length) geoms.push(makeGeometry(pts));
      });
      // shapes (fills) converted to outlines
      if (path.toShapes) {
        path.toShapes(true).forEach((shape: any) => {
          const pts = shape.getPoints(200);
          if (pts.length) geoms.push(makeGeometry(pts));
        });
      }
    });

    return geoms;
  }, [paths]);
  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: '#00ffff',
        linewidth: 2,
        transparent: true,
        opacity: 0.9
      }),
    []
  );

  const outlineRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 1.5) * 0.01;
    if (outlineRef.current) {
      outlineRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={outlineRef}>
      {lines.map((geometry: any, idx: number) => (
        <lineSegments key={`outline-${idx}`} geometry={geometry} material={material} />
      ))}
    </group>
  );
}

function Particles({ count = 260 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 900;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 900;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 400;
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
        color: '#00ffff',
        size: 2.2,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
    []
  );

  const pointsRef = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.03;
      pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

function Scene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={1} />
      <Suspense fallback={null}>
        <Particles count={isMobile ? 150 : 260} />
        <IndiaOutline />
      </Suspense>
      <OrbitControlsMinimal />
      {/* optional slight fog for depth */}
      <fog attach="fog" args={['#000000', 200, 1400]} />
    </>
  );
}

export default function IndiaMapBackground() {
  return (
    <Canvas camera={{ position: [0, 0, 800], fov: 55 }} gl={{ antialias: true, alpha: true }}>
      <Scene />
    </Canvas>
  );
}
