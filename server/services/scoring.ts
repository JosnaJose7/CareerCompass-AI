import { calculate11DimensionReadiness, DIMENSION_WEIGHTS } from '../../src/utils/readinessScoring';

export { calculate11DimensionReadiness, DIMENSION_WEIGHTS };

/**
 * Calculates weighted sum of the 11-dimensional readiness breakdown
 */
export function calculateWeightedReadinessScore(breakdown: Record<keyof typeof DIMENSION_WEIGHTS, number>): number {
  let weightedSum = 0;
  for (const key of Object.keys(DIMENSION_WEIGHTS) as Array<keyof typeof DIMENSION_WEIGHTS>) {
    weightedSum += (breakdown[key] || 0) * DIMENSION_WEIGHTS[key];
  }
  return Math.min(98, Math.max(25, Math.round(weightedSum)));
}
