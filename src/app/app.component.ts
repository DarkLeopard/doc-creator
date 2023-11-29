import {Component, ViewChild} from '@angular/core';
import {DialogService, DynamicDialogConfig} from 'primeng/dynamicdialog';
import {CreateProtocolComponent} from './components/create-protocol/create-protocol.component';
import {PrintProtocolInterface, ProtocolInterface} from './interfaces/protocol.interface';
import {ExportService} from './services/export.service';
import {FileSelectEvent, FileUpload} from 'primeng/fileupload';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import {saveAs} from 'file-saver';
import moment from 'moment/moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DialogService],
})
export class AppComponent {
  @ViewChild('jsonImportBtn') jsonImportBtn!: FileUpload;
  @ViewChild('wordImportBtn') wordImportBtn!: FileUpload;

  protocols: ProtocolInterface[] = [];
  wordTemplate: Docxtemplater<PizZip> | undefined;

  constructor(
    private readonly dialogService: DialogService,
    private readonly exportService: ExportService,
  ) {
  }

  exportJSON() {
    this.exportService.exportJSON(this.protocols);
  }

  importJSON(event: FileSelectEvent) {
    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent) => {
      if (fileLoadedEvent.target) {
        const textFromFileLoaded = fileLoadedEvent.target.result;
        const json = JSON.parse(textFromFileLoaded as any);

        this.protocols = json;
        this.jsonImportBtn.clear();
      }
    };
    fileReader.readAsText(event.currentFiles[0], 'UTF-8');
  }

  clearSystem() {
    this.protocols = [];
  }

  saveLS() {
    localStorage.setItem('db', JSON.stringify(this.protocols));
  }

  loadLS() {
    const db = localStorage.getItem('db');
    if (db) {
      this.protocols = JSON.parse(db);
    }
  }

  clearLS() {
    localStorage.clear();
  }

  importWord(event: FileSelectEvent) {
    const fileReader = new FileReader();

    fileReader.readAsBinaryString(event.currentFiles[0]);

    fileReader.onerror = (event) => {
      console.log('error reading file', event);
    };

    fileReader.onload = (fileLoadedEvent) => {
      if (!fileLoadedEvent.target || !fileLoadedEvent.target.result) {
        console.error('error reading file');
        return;
      }

      const content = fileLoadedEvent.target.result;
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      this.wordTemplate = doc;
    };
  }

  exportWord(protocol: ProtocolInterface) {
    const doc = this.wordTemplate;

    if (!doc) {
      console.error('error reading file');
      return;
    }

    const printProtocolData: PrintProtocolInterface = {
      ...protocol,
      date: moment((protocol.date)).format('DD.MM.YYYY'),
      arrivalDate: moment((protocol.arrivalDate)).format('DD.MM.YYYY'),
      examineDate: moment((protocol.examineDate)).format('DD.MM.YYYY'),
      samples: protocol.samples.map((sample, index) => ({
        ...sample,
        order: index + 1,
      })),
    };

    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render(printProtocolData);

    const blob = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: 'DEFLATE',
    });
    // Output the document using Data-URI
    saveAs(blob, 'output.docx');
  }

  openEditModal(protocol: ProtocolInterface) {
    const ref = this.dialogService.open(CreateProtocolComponent, {
      data: protocol,
      header: 'Создать новый протокол',
      showHeader: true,
      width: '80%',
      height: '90%',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false,
    } as DynamicDialogConfig<ProtocolInterface>);

    ref.onClose.subscribe((value: ProtocolInterface) => {
      if (value) {
        console.log(value);
        const index = this.protocols.findIndex((protocol) => protocol.id === value.id);
        if (index !== -1) {
          this.protocols[index] = value;
        }
      }
    });
  }

  deleteProtocol(protocol: ProtocolInterface) {
    const index = this.protocols.findIndex((protocol) => protocol.id === protocol.id);
    if (index !== -1) {
      this.protocols.splice(index, 1);
    }
  }

  openCreateModal() {
    const ref = this.dialogService.open(CreateProtocolComponent, {
      header: 'Создать новый протокол',
      showHeader: true,
      width: '80%',
      height: '90%',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false,
    });

    ref.onClose.subscribe((value: ProtocolInterface) => {
      if (value) {
        this.protocols.push(value);
      }
    });
  }
}
