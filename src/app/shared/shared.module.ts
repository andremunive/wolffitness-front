import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { TableComponent } from './components/table/table.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NavbarComponent,
    SearchBarComponent,
    TableComponent,
    LoaderComponent,
  ],
  exports: [NavbarComponent, SearchBarComponent, TableComponent],
})
export class SharedModule {}
