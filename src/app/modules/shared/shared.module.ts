import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { TableComponent } from './components/table/table.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CardComponent } from './components/card/card.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    SideBarComponent,
    TableComponent,
    LoaderComponent,
    ToolbarComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  exports: [
    SideBarComponent,
    TableComponent,
    LoaderComponent,
    ToolbarComponent,
    CardComponent,
  ],
})
export class SharedModule {}
