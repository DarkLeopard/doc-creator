import {SampleInterface} from './sample.interface';
import {ClientEnum} from './client.enum';

export interface ProtocolInterface {
  id: number;
  date: string; // iso-string
  client: ClientEnum;
  arrivalDate: string; // iso-string
  state: SampleInterface;
  samples: SampleInterface[];
  samplesCount: number;
  examineDate: string; // iso-string
  pressure: number;
  temperature: number;
  humidity: number;
  executor1: string;
  executor2: string;
}
