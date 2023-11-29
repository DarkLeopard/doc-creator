export interface SampleInterface {
  id: string; // 4 numbers
  name: string;
  sample1: number;
  sample2: number;
  average: number; // sample1 + sample2 / 2
  difference: number; // sample1 - sample2
  r: number; // manual value
}

export interface PrintSampleInterface extends SampleInterface {
  order: number;
}
