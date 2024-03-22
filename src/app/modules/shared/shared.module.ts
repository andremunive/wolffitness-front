import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { TableComponent } from './components/table/table.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [SideBarComponent, TableComponent, LoaderComponent],
  imports: [CommonModule, NgxSpinnerModule],
  exports: [SideBarComponent, TableComponent, LoaderComponent],
})
export class SharedModule {}
