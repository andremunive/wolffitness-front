import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainerRoutingModule } from './trainer-routing.module';
import { TrainerComponent } from './container/trainer/trainer.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AllClientsComponent } from './components/all-clients/all-clients.component';
import { AddClientsComponent } from './components/add-clients/add-clients.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { EditClientComponent } from './components/edit-client/edit-client.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProgressComponent } from './components/progress/progress.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { PaymentComponent } from './components/payment/payment.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
@NgModule({
  declarations: [
    TrainerComponent,
    AllClientsComponent,
    AddClientsComponent,
    EditClientComponent,
    ProgressComponent,
    AssessmentComponent,
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatInputModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatSlideToggleModule,
  ],
})
export class TrainerModule {}
