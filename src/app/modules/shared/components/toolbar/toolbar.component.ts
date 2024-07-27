import { Component, Input } from '@angular/core';
import { ToolbarModel } from 'src/app/core/models/toolbar.model';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Input() toolbarMenu: ToolbarModel[];

  constructor(private _global: GlobalService, private _auth: AuthService) {}

  changePage(page: string) {
    this._global.updatePageSelected(page);
  }

  logout() {
    this._auth.logOut();
  }
}
