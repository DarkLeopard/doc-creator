import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {CreateProtocolComponent} from './components/create-protocol/create-protocol.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {ButtonModule} from 'primeng/button';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {TableModule} from 'primeng/table';
import {InputMaskModule} from 'primeng/inputmask';
import {RippleModule} from 'primeng/ripple';
import { SampleTableComponent } from './components/sample-table/sample-table.component';
import {FileUploadModule} from 'primeng/fileupload';

@NgModule({
  declarations: [AppComponent, CreateProtocolComponent, SampleTableComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    TableModule,
    InputMaskModule,
    RippleModule,
    FileUploadModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
  }
}
