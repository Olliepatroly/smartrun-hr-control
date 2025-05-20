
export interface HealthMetrics {
  id: string;
  user_id: string;
  weight: number | null;
  height: number | null;
  vo2max: number | null;
  resting_heart_rate: number | null;
  max_heart_rate: number | null;
  cardiac_disability: string | null;
  created_at: string;
  updated_at: string;
}

export type CardiacDisabilityOption = 'CABG' | 'Arrhythmia' | 'MI' | 'none' | null;
