/**
 * Shared geo transform for India map and state nodes.
 * GeoJSON uses [longitude, latitude]. We project to 3D x,y with z=0.
 * Supports Polygon and MultiPolygon.
 */
const CENTER_LNG = 78;
const CENTER_LAT = 22;
const SCALE = 10;

export function project(lng: number, lat: number): [number, number] {
  return [(lng - CENTER_LNG) * SCALE, (lat - CENTER_LAT) * SCALE];
}

export type GeoFeature = {
  type: string;
  properties?: { name?: string; isOutline?: boolean; NAME_1?: string };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
};

function isMultiPolygon(coords: number[][][] | number[][][][]): coords is number[][][][] {
  const first = coords[0]?.[0]?.[0];
  return typeof first !== 'number';
}

/** Get all outer rings from a feature (Polygon or MultiPolygon). */
export function getRings(feature: GeoFeature): number[][][] {
  const coords = feature.geometry.coordinates;
  if (isMultiPolygon(coords)) {
    return coords.map((poly) => poly[0] as number[][]);
  }
  return [coords[0] as number[][]];
}

/** Compute centroid [x, y, z] for each feature (first ring only). */
export function getCentroids(features: GeoFeature[]): [number, number, number][] {
  return features.map((feature) => {
    const rings = getRings(feature);
    const ring = rings[0];
    if (!ring || ring.length === 0) return [0, 0, 0];
    let sumLng = 0, sumLat = 0;
    for (let i = 0; i < ring.length; i++) {
      sumLng += ring[i][0];
      sumLat += ring[i][1];
    }
    const [x, y] = project(sumLng / ring.length, sumLat / ring.length);
    return [x, y, 0];
  });
}

/** Center of the map (average of state centroids) for centering the camera view. */
export function getMapCenter(features: GeoFeature[]): [number, number] {
  const centroids = getCentroids(features);
  if (centroids.length === 0) return [0, 0];
  const cx = centroids.reduce((s, c) => s + c[0], 0) / centroids.length;
  const cy = centroids.reduce((s, c) => s + c[1], 0) / centroids.length;
  return [cx, cy];
}

/** Simplify a ring by sampling every step-th point (maxPoints cap). */
export function simplifyRing(ring: number[][], maxPoints: number): number[][] {
  if (ring.length <= maxPoints) return ring;
  const step = ring.length / maxPoints;
  const out: number[][] = [];
  for (let i = 0; i < maxPoints; i++) {
    const idx = Math.min(Math.floor(i * step), ring.length - 1);
    out.push(ring[idx]);
  }
  return out;
}
