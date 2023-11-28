import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {CreateProtocolComponent} from './components/create-protocol/create-protocol.component';
import {ProtocolInterface} from './interfaces/protocol.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protocols: ProtocolInterface[] = [];

  constructor(
    private readonly dialogService: DialogService,
  ) {
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
      this.protocols.push(value);
    })
  }
}
