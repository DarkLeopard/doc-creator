import {Component, Input} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {takeUntil} from 'rxjs';
import {Unsubscriber} from '../../services/unsubscriber.service';
import {SampleForm} from '../create-protocol/sample-form-interface';
import {SampleInterface} from '../../interfaces/sample.interface';

@Component({
  selector: 'app-sample-table',
  templateUrl: './sample-table.component.html',
  styleUrl: './sample-table.component.scss',
  providers: [Unsubscriber],
})
export class SampleTableComponent {
  @Input() samplesFA: FormArray<FormGroup<SampleForm>> = new FormArray<FormGroup<SampleForm>>([]);
  @Input() canEdit: boolean = false;

  samples: SampleInterface[] = [];

  constructor(
    private readonly unsubscriber: Unsubscriber,
  ) {
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
    const formGroup = this.createSampleFormGroup();

    if (formGroup) {
      this.samplesFA.push(formGroup);

      this.setSamplesFromFA();
    }
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

  private createSampleFormGroup(): FormGroup<SampleForm> | undefined {
    const formGroup = new FormGroup<SampleForm>({
      id: new FormControl<string>('0000', {nonNullable: true}),
      sample1: new FormControl<number>(0, {nonNullable: true}),
      sample2: new FormControl<number>(0, {nonNullable: true}),
      average: new FormControl<number>(0, {nonNullable: true}),
      difference: new FormControl<number>(0, {nonNullable: true}),
      r: new FormControl<number>(0, {nonNullable: true}),
    });

    formGroup.valueChanges
      .pipe(
        takeUntil(this.unsubscriber.destroy$),
      )
      .subscribe((value) => {
        if (value.sample1 !== undefined && value.sample2 !== undefined) {
          formGroup.controls.average.setValue((value.sample1 + value.sample2) / 2, {emitEvent: false});
          formGroup.controls.difference.setValue(value.sample1 - value.sample2, {emitEvent: false});
        }
      });

    return formGroup;
  }
}
