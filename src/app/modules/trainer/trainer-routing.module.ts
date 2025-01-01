import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainerComponent } from './container/trainer/trainer.component';
import { ClientProfileComponent } from '../shared/components/client-profile/client-profile.component';

const routes: Routes = [
  {
    path: '',
    component: TrainerComponent,
  },
  {
    path: 'client/:clientId',
    component: ClientProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainerRoutingModule {}
