import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './container/admin/admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AllClientsComponent } from './components/all-clients/all-clients.component';
import { ClientsFilterComponent } from './components/clients-filter/clients-filter.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [AdminComponent, AllClientsComponent, ClientsFilterComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
})
export class AdminModule {}
