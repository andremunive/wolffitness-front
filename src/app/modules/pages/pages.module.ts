import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { MainComponent } from './main/main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientsComponent } from './components/clients/clients.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [MainComponent, ClientsComponent, HomeComponent],
  imports: [CommonModule, PagesRoutingModule, SharedModule],
})
export class PagesModule {}
