import {Injectable} from '@angular/core';
import {ProtocolInterface} from '../interfaces/protocol.interface';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportJSON(protocols: ProtocolInterface[]) {
    const sJson = JSON.stringify(protocols);
    const element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
    element.setAttribute('download', "primer-server-task.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }
}
