export type HealthStatus =
  | 'Healthy'
  | 'Diseased'
  | 'Pest Damage'
  | 'Nutrient Deficiency'
  | 'Post-Harvest Spoilage'
  | 'Environmental Stress';

export type SeverityLevel = 'None' | 'Low' | 'Moderate' | 'Severe' | 'Critical';

export interface ChemicalTreatment {
  medicineName: string;
  activeIngredient: string;
  dosage: string;
  instructions: string;
  safetyIntervalDays: number;
}

export interface CropAnalysisResult {
  id: string;
  timestamp: string;
  cropName: string;
  cropType: string;
  varietyDetected?: string;
  healthStatus: HealthStatus;
  isHealthy: boolean;
  severity: SeverityLevel;
  confidence: number;
  diseaseName: string;
  diseaseNameLocal?: string;
  scientificName?: string;
  affectedPart: string;
  visualSymptoms: string[];
  causeAndPathogen: string;
  favorableConditions: string;
  immediateAction: string;
  organicTreatments: string[];
  chemicalControls: ChemicalTreatment[];
  preventiveMeasures: string[];
  yieldLossRisk: string;
  spoilageOrStorageAdvisory?: string;
  summaryVoiceScript: string;
  imageUrl?: string;
  cropHint?: string;
  fieldNotes?: string;
}

export interface SampleCropCase {
  id: string;
  title: string;
  crop: string;
  condition: string;
  severity: SeverityLevel;
  status: HealthStatus;
  imageUrl: string;
  description: string;
  defaultSymptoms: string[];
}

export interface AgroDiseaseGuideItem {
  id: string;
  crop: string;
  name: string;
  nameUrdu?: string;
  nameHindi?: string;
  type: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Deficiency' | 'Storage Spoilage';
  severity: SeverityLevel;
  symptoms: string[];
  causes: string;
  prevention: string[];
  recommendedCures: string[];
  season: string;
  imageUrl: string;
}

export interface CropMismatchError {
  isCropMismatch: boolean;
  selectedCrop: string;
  detectedCrop: string;
  message: string;
  messageUrdu?: string;
}

export interface ConsultationMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
