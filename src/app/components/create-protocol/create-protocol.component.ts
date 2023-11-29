import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ClientEnum} from '../../interfaces/client.enum';
import {SampleInterface} from '../../interfaces/sample.interface';
import {SampleStateEnum} from '../../interfaces/sample-state.enum';
import {Unsubscriber} from '../../services/unsubscriber.service';
import {takeUntil} from 'rxjs';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ProtocolInterface} from '../../interfaces/protocol.interface';
import {SampleForm} from './sample-form-interface';

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

@Component({
  selector: 'app-create-protocol',
  templateUrl: './create-protocol.component.html',
  styleUrl: './create-protocol.component.scss',
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

  editMode: boolean = false;

  constructor(
    private readonly dialogRef: DynamicDialogRef,
    private readonly dialogConfig: DynamicDialogConfig<ProtocolInterface>,
    private readonly unsubscriber: Unsubscriber,
  ) {

  }

  ngOnInit(): void {
    if (this.dialogConfig.data) {
      this.editMode = true;
      this.form.controls.id.disable();

      // adapter
      const data = {
        ...this.dialogConfig.data,
        date: new Date(this.dialogConfig.data.date),
        arrivalDate: new Date(this.dialogConfig.data.arrivalDate),
        examineDate: new Date(this.dialogConfig.data.examineDate),
      }

      this.form.patchValue(data);
    }

    this.form.controls.samples.valueChanges
      .pipe(
        takeUntil(this.unsubscriber.destroy$),
      )
      .subscribe((samples) => {
        this.form.controls.samplesCount.setValue(samples.length);
      });
  }

  submit() {
    if (this.form.invalid) {
      this.form.controls.id.markAsDirty();
      return;
    }

    this.dialogRef.close(this.form.value);
  }

  private createFormGroup(): FormGroup<CreateProtocolForm> {
    return new FormGroup<CreateProtocolForm>({
      id: new FormControl<number>(0, {nonNullable: true, validators: Validators.min(1)}),
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
