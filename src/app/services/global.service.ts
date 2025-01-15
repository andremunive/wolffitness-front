import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private pageSelected: BehaviorSubject<string>;
  private userUpdated: BehaviorSubject<boolean>;
  private dataUpdated: BehaviorSubject<boolean>;

  constructor() {
    this.pageSelected = new BehaviorSubject<string>('Perfil');
    this.userUpdated = new BehaviorSubject<boolean>(false);
    this.dataUpdated = new BehaviorSubject<boolean>(false);
  }

  getDataUpdatedObservable() {
    return this.dataUpdated.asObservable();
  }

  updateDataUpdated(value: boolean) {
    this.dataUpdated.next(value);
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
