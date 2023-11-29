import {SampleInterface, PrintSampleInterface} from './sample.interface';
import {ClientEnum} from './client.enum';
import {SampleStateEnum} from './sample-state.enum';

export interface ProtocolInterface {
  id: number;
  date: string; // iso-string
  client: ClientEnum;
  arrivalDate: string; // iso-string
  state: SampleStateEnum;
  samples: SampleInterface[];
  samplesCount: number;
  examineDate: string; // iso-string
  pressure: number;
  temperature: number;
  humidity: number;
  executor1: string;
  executor2: string;
}

export interface PrintProtocolInterface extends ProtocolInterface {
  samples: PrintSampleInterface[];
}
