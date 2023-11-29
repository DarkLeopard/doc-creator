import {Component, ViewChild} from '@angular/core';
import {DialogService, DynamicDialogConfig} from 'primeng/dynamicdialog';
import {CreateProtocolComponent} from './components/create-protocol/create-protocol.component';
import {ProtocolInterface} from './interfaces/protocol.interface';
import {ExportService} from './services/export.service';
import {FileSelectEvent, FileUpload} from 'primeng/fileupload';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DialogService],
})
export class AppComponent {
  @ViewChild('jsonImportBtn') jsonImportBtn!: FileUpload;

  protocols: ProtocolInterface[] = [];

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
        this.jsonImportBtn.clear()
      }
    };
    fileReader.readAsText(event.currentFiles[0], "UTF-8");
  }

  clearSystem() {
    this.protocols = [];
  }

  saveLS() {
    // TODO
  }

  loadLS() {
    // TODO
  }

  clearLS() {
    // TODO
  }

  importWord() {
    // TODO
  }

  exportWord() {
    // TODO
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
