export interface RefluxEntry {
  id: string; // benzersiz id
  timestamp: number; // kaydın eklendiği tarih
  meal: string; // yenilen yemek
  symptoms: string[]; // semptomlar öksürük, mide yanması vs
  severity: number; // şiddet derecesi
  notes?: string; //  notlar ilerde eklenecek
}
