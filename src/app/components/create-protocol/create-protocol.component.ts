import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ClientEnum} from '../../interfaces/client.enum';
import {SampleInterface} from '../../interfaces/sample.interface';
import {SampleStateEnum} from '../../interfaces/sample-state.enum';
import {Unsubscriber} from '../../services/unsubscriber.service';
import {takeUntil} from 'rxjs';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

interface CreateProtocolForm {
  id: FormControl<number>;
  date: FormControl<Date>;
  client: FormControl<ClientEnum>;
  arrivalDate: FormControl<Date>;
  state: FormControl<SampleStateEnum>;
  samples: FormArray<FormGroup<SampleForm>>;
  samplesCount: FormControl<number>;
  examineDate: FormControl<Date>;
  pressure: FormControl<number>;
  temperature: FormControl<number>;
  humidity: FormControl<number>;
  executor1: FormControl<string>;
  executor2: FormControl<string>;
}

interface SampleForm {
  id: FormControl<string>;
  sample1: FormControl<number>;
  sample2: FormControl<number>;
  average: FormControl<number>;
  difference: FormControl<number>;
  r: FormControl<number>;
}

@Component({
  selector: 'app-create-protocol',
  templateUrl: './create-protocol.component.html',
  styleUrl: './create-protocol.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Unsubscriber],
})
export class CreateProtocolComponent implements OnInit {
  form: FormGroup<CreateProtocolForm> = this.createFormGroup();

  clients = [
    ClientEnum.Client1,
    ClientEnum.Client2,
    ClientEnum.Client3,
    ClientEnum.Client4,
    ClientEnum.Client5,
  ];

  states = [
    SampleStateEnum.State1,
    SampleStateEnum.State2,
    SampleStateEnum.State3,
    SampleStateEnum.State4,
  ];

  samples: SampleInterface[] = [];
  clonedSamples: { [key: number]: SampleInterface } = {};

  constructor(
    private readonly unsubscriber: Unsubscriber,
    private readonly dialogRef: DynamicDialogRef,
  ) {
  }

  ngOnInit(): void {
    this.form.controls.samples.valueChanges
      .pipe(
        takeUntil(this.unsubscriber.destroy$),
      )
      .subscribe((samples) => {
        this.form.controls.samplesCount.setValue(samples.length);
      });
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }

  getSamplesFCByIndex(index: number): FormGroup<SampleForm>;
  getSamplesFCByIndex(index: number, control: keyof SampleForm): FormControl;
  getSamplesFCByIndex(index: number, control?: keyof SampleForm): FormGroup<SampleForm> | FormControl {
    if (control) {
      return this.form.controls.samples.at(index).controls[control];
    }
    return this.form.controls.samples.at(index);
  }

  addSample() {
    const formGroup = this.createSampleFormGroup();

    if (formGroup) {
      this.form.controls.samples.push(formGroup);

      this.setSamplesFromFA();
    }
  }

  onEditComplete() {
    this.setSamplesFromFA();
  }

  deleteSample(index: number) {
    this.form.controls.samples.removeAt(index);
    this.setSamplesFromFA();
  }

  private setSamplesFromFA() {
    this.samples = this.form.controls.samples.controls.map((form) => {
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

  private createFormGroup(): FormGroup<CreateProtocolForm> {
    return new FormGroup<CreateProtocolForm>({
      id: new FormControl<number>(0, {nonNullable: true}),
      date: new FormControl<Date>(new Date(), {nonNullable: true}),
      client: new FormControl<ClientEnum>(ClientEnum.Client1, {nonNullable: true}),
      arrivalDate: new FormControl<Date>(new Date(), {nonNullable: true}),
      state: new FormControl<SampleStateEnum>(SampleStateEnum.State1, {nonNullable: true}),
      samples: new FormArray<FormGroup<SampleForm>>([]),
      samplesCount: new FormControl<number>({disabled: true, value: 0}, {nonNullable: true}),
      examineDate: new FormControl<Date>(new Date(), {nonNullable: true}),
      pressure: new FormControl<number>(0, {nonNullable: true}),
      temperature: new FormControl<number>(0, {nonNullable: true}),
      humidity: new FormControl<number>(0, {nonNullable: true}),
      executor1: new FormControl<string>('', {nonNullable: true}),
      executor2: new FormControl<string>('', {nonNullable: true}),
    });
  }
}
