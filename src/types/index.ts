export interface RefluxEntry {
  id: string;
  timestamp: number;
  meal: string; // yenilen yemek
  symptoms: string[]; // semptomlar öksürük, mide yanması vs
  severity: number; // şiddet derecesi
  notes?: string; //  notlar ilerde eklenecek
}
