import React, { useMemo, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import IndiaMap from './IndiaMap';
import StateNodes from './StateNodes';
import TradeRoutes from './TradeRoutes';
import Particles from './Particles';
import { getMapCenter } from './geo';
import type { GeoFeature } from './geo';

const GEOJSON_URL = `${process.env.PUBLIC_URL || ''}/india_state_geo.json`;

function SceneContent({ features }: { features: GeoFeature[] }) {
  const mapCenter = useMemo(
    () => getMapCenter(features),
    [features]
  );

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 200, 550]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[80, 60, 120]} intensity={1} color="#00C896" />
      <pointLight position={[-60, -40, 80]} intensity={0.5} color="#3B82F6" />
      <group position={[-mapCenter[0], -mapCenter[1], 0]}>
        <IndiaMap features={features} />
        <StateNodes features={features} />
        <TradeRoutes features={features} />
      </group>
      <Particles />
      <OrbitControls
        autoRotate={false}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </>
  );
}

const wrapperStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100vh',
  minHeight: '100vh',
  zIndex: -10,
  pointerEvents: 'none',
};

export default function IndiaNetworkBackground() {
  const [geojson, setGeojson] = useState<{ features: GeoFeature[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((data: { type: string; features: GeoFeature[] }) => {
        if (!cancelled && data.features?.length) {
          setGeojson({ features: data.features });
        }
      })
      .catch(() => {
        if (!cancelled) setGeojson({ features: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={wrapperStyle}>
      <Canvas
        camera={{ position: [0, 0, 400], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {geojson && geojson.features.length > 0 ? (
          <SceneContent features={geojson.features} />
        ) : null}
      </Canvas>
    </div>
  );
}
