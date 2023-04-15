export interface PopulationType {
  year: number;
  value: number;
}

export interface PrefectureType {
  prefCode: number;
  prefName: string;
}

export interface PrefDate {
  id: number;
  data: {
    year: number;
    [key: string]: number;
  };
}
