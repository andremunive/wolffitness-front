import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [SideBarComponent, TableComponent],
  imports: [CommonModule],
  exports: [SideBarComponent, TableComponent],
})
export class SharedModule {}
