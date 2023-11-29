import {Component} from '@angular/core';
import {DialogService, DynamicDialogConfig} from 'primeng/dynamicdialog';
import {CreateProtocolComponent} from './components/create-protocol/create-protocol.component';
import {ProtocolInterface} from './interfaces/protocol.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DialogService],
})
export class AppComponent {
  protocols: ProtocolInterface[] = [];

  constructor(
    private readonly dialogService: DialogService,
  ) {
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
