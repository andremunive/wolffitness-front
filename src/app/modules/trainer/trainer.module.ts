import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainerRoutingModule } from './trainer-routing.module';
import { TrainerComponent } from './container/trainer/trainer.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [TrainerComponent],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class TrainerModule {}
