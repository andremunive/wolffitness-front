import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainerComponent } from './container/trainer/trainer.component';
import { AllClientsComponent } from './components/all-clients/all-clients.component';
import { AddClientsComponent } from './components/add-clients/add-clients.component';

const routes: Routes = [
  {
    path: '',
    component: TrainerComponent,
  },
  // { path: 'all-clients', component: AllClientsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainerRoutingModule {}
