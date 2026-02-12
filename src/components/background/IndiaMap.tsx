import React, { useMemo } from 'react';
import * as THREE from 'three';
import { project, getRings, simplifyRing } from './geo';
import type { GeoFeature } from './geo';

const LINE_COLOR = '#00C896';
const LINE_OPACITY = 0.55;
const MAX_POINTS_PER_RING = 80;

type IndiaMapProps = {
  features: GeoFeature[];
};

export default function IndiaMap({ features }: IndiaMapProps) {
  const { geometries } = useMemo(() => {
    const geoms: THREE.BufferGeometry[] = [];
    for (const feature of features) {
      const rings = getRings(feature);
      for (const ring of rings) {
        if (ring.length < 2) continue;
        const simplified = simplifyRing(ring, MAX_POINTS_PER_RING);
        const points = simplified.map((p) => {
          const [x, y] = project(p[0], p[1]);
          return new THREE.Vector3(x, y, 0);
        });
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        geom.computeBoundingSphere();
        geoms.push(geom);
      }
    }
    return { geometries: geoms };
  }, [features]);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: LINE_COLOR,
        transparent: true,
        opacity: LINE_OPACITY,
      }),
    []
  );

  if (geometries.length === 0) return null;

  return (
    <group>
      {geometries.map((geometry, idx) => (
        <lineLoop key={`state-${idx}`} geometry={geometry} material={material} />
      ))}
    </group>
  );
}
