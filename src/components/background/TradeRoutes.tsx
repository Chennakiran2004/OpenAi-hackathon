import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getCentroids } from './geo';
import type { GeoFeature } from './geo';

const LINE_COLOR = '#00C896';
const LINE_OPACITY_BASE = 0.4;
const LINE_OPACITY_PULSE = 0.35;
const MOVING_SPHERE_COLOR = '#00C896';
const CURVE_POINTS = 32;
const SPEED = 0.35;
const LINE_PULSE_SPEED = 2;

/** State index pairs for trade routes (indices into centroids). Works with any number of states. */
const ROUTE_PAIRS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [1, 9], [3, 10], [8, 11], [2, 12],
];

type TradeRoutesProps = {
  features: GeoFeature[];
};

function makeCurve(start: [number, number, number], end: [number, number, number]): THREE.CatmullRomCurve3 {
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  const offset = 8;
  const ctrl: [number, number, number] = [midX + offset, midY + offset, 0];
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(...start),
    new THREE.Vector3(...ctrl),
    new THREE.Vector3(...end),
  ]);
}

export default function TradeRoutes({ features }: TradeRoutesProps) {
  const centroids = useMemo(() => getCentroids(features), [features]);
  const curves = useMemo(() => {
    return ROUTE_PAIRS.filter(
      ([a, b]) => a < centroids.length && b < centroids.length
    ).map(([a, b]) => makeCurve(centroids[a], centroids[b]));
  }, [centroids]);
  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: LINE_COLOR,
        transparent: true,
        opacity: LINE_OPACITY_BASE,
      }),
    []
  );
  const lineMaterialRef = useRef(lineMaterial);
  lineMaterialRef.current = lineMaterial;

  const lineObjects = useMemo(() => {
    return curves.map((curve) => {
      const pts = curve.getPoints(CURVE_POINTS);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      return new THREE.Line(geom, lineMaterial);
    });
  }, [curves, lineMaterial]);
  const movingRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const t = (elapsed * SPEED) % 1;
    movingRefs.current.forEach((mesh, i) => {
      if (mesh && curves[i]) {
        const point = curves[i].getPointAt(t);
        mesh.position.copy(point);
      }
    });
    lineMaterialRef.current.opacity =
      LINE_OPACITY_BASE + LINE_OPACITY_PULSE * Math.sin(elapsed * LINE_PULSE_SPEED);
  });

  return (
    <group>
      {lineObjects.map((lineObj, idx) => (
        <primitive key={`route-line-${idx}`} object={lineObj} />
      ))}
      {curves.map((_, idx) => (
        <mesh
          key={`route-dot-${idx}`}
          ref={(el) => {
            if (el) movingRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color={MOVING_SPHERE_COLOR}
            emissive={MOVING_SPHERE_COLOR}
            emissiveIntensity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}
