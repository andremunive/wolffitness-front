import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private pageSelected: BehaviorSubject<string>;
  private userUpdated: BehaviorSubject<boolean>;

  constructor() {
    this.pageSelected = new BehaviorSubject<string>('Asesorados');
    this.userUpdated = new BehaviorSubject<boolean>(false);
  }

  getPageSelectedObservable() {
    return this.pageSelected.asObservable();
  }

  updatePageSelected(page: string) {
    this.pageSelected.next(page);
  }
  getUserUpdatedObservable() {
    return this.userUpdated.asObservable();
  }

  updateUserUpdated(updated: boolean) {
    this.userUpdated.next(updated);
  }
}
