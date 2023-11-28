import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class Unsubscriber implements OnDestroy {
  private readonly destroySubject: Subject<void> = new Subject<void>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly destroy$: Observable<void> = this.destroySubject.asObservable();

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
