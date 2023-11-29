import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {Observable, takeUntil} from 'rxjs';
import {Unsubscriber} from '../../services/unsubscriber.service';
import {SampleForm} from '../create-protocol/sample-form-interface';
import {SampleInterface} from '../../interfaces/sample.interface';

@Component({
  selector: 'app-sample-table',
  templateUrl: './sample-table.component.html',
  styleUrl: './sample-table.component.scss',
  providers: [Unsubscriber],
})
export class SampleTableComponent implements OnInit {
  @Input() samplesFA: FormArray<FormGroup<SampleForm>> = new FormArray<FormGroup<SampleForm>>([]);
  @Input() samples: SampleInterface[] = [];
  @Input() canEdit: boolean = false;


  constructor(
    private readonly unsubscriber: Unsubscriber,
  ) {
  }

  ngOnInit() {
    if (this.samplesFA.length === 0 && this.samples.length > 0) {
      this.samples.forEach((sample) => {
        this.samplesFA.push(this.createSampleFormGroup(sample, this.unsubscriber.destroy$));
      });
    }
  }


  getSamplesFCByIndex(index: number): FormGroup<SampleForm>;
  getSamplesFCByIndex(index: number, control: keyof SampleForm): FormControl;
  getSamplesFCByIndex(index: number, control?: keyof SampleForm): FormGroup<SampleForm> | FormControl {
    if (control) {
      return this.samplesFA.at(index).controls[control];
    }
    return this.samplesFA.at(index);
  }

  addSample() {
    this.samplesFA.push(this.createSampleFormGroup(undefined, this.unsubscriber.destroy$));

    this.setSamplesFromFA();
  }

  onEditComplete() {
    this.setSamplesFromFA();
  }

  deleteSample(index: number) {
    this.samplesFA.removeAt(index);
    this.setSamplesFromFA();
  }

  private setSamplesFromFA() {
    this.samples = this.samplesFA.controls.map((form) => {
      return {
        id: form.controls.id.value,
        sample1: form.controls.sample1.value,
        sample2: form.controls.sample2.value,
        average: form.controls.average.value,
        difference: form.controls.difference.value,
        r: form.controls.r.value,
      };
    });
  }

  private createSampleFormGroup(sample?: SampleInterface, calcDestroyObs?: Observable<void>): FormGroup<SampleForm> {
    const formGroup = new FormGroup<SampleForm>({
      id: new FormControl<string>(sample?.id ?? '0000', {nonNullable: true}),
      sample1: new FormControl<number>(sample?.sample1 ?? 0, {nonNullable: true}),
      sample2: new FormControl<number>(sample?.sample2 ?? 0, {nonNullable: true}),
      average: new FormControl<number>(sample?.average ?? 0, {nonNullable: true}),
      difference: new FormControl<number>(sample?.difference ?? 0, {nonNullable: true}),
      r: new FormControl<number>(sample?.r ?? 0, {nonNullable: true}),
    });

    if (calcDestroyObs) {
      formGroup.valueChanges
        .pipe(
          takeUntil(calcDestroyObs),
        )
        .subscribe((value) => {
          if (value.sample1 !== undefined && value.sample2 !== undefined) {
            formGroup.controls.average.setValue((value.sample1 + value.sample2) / 2, {emitEvent: false});
            formGroup.controls.difference.setValue(value.sample1 - value.sample2, {emitEvent: false});
          }
        });
    }

    return formGroup;
  }
}
