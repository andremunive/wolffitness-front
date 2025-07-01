import { Component, OnInit, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';
import { NavbarMenuModel } from 'src/app/core/models/navbar-menu.model';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule,
  ],
})
export class NavbarComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  currentUrl: string = '';

  navbarMenu: NavbarMenuModel[] = [
    {
      name: 'clients',
      text: 'Clientes',
      active: true,
      hasPermission: false,
      URL: '/clients',
    },
    {
      name: 'torombolo',
      text: 'sadasd',
      active: false,
      hasPermission: true,
      URL: '',
    },
  ];

  constructor(
    private _cookiesStorage: CookieStorageService,
    private router: Router,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     this.navbarMenu.map((menu) => {
    //       if (menu.URL === this.router.url) menu.active = true;
    //     });
    //   });
    // this.getPermissions();
    // this.initRoute();
  }

  getPermissions(): void {
    const permissionsCookie = this._cookiesStorage.getCookie('permissions');
    const permissions = JSON.parse(permissionsCookie);
    this.navbarMenu.map((menu) => {
      menu.hasPermission = permissions[menu.name] ?? false;
    });
  }

  initRoute() {
    const ROUTE = this.navbarMenu.find((menu) => menu.active);
    this.router.navigate([`/${ROUTE.URL}`]);
  }

  toggleDrawer() {
    this.drawer.toggle();
  }

  logout() {
    this._auth.logOut();
  }
}
