import {FormControl} from '@angular/forms';

export interface SampleForm {
  id: FormControl<string>;
  name: FormControl<string>;
  sample1: FormControl<number>;
  sample2: FormControl<number>;
  average: FormControl<number>;
  difference: FormControl<number>;
  r: FormControl<number>;
}
