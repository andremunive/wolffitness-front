import { AfterViewInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { ClientModel } from 'src/app/core/models/client.model';
import { ClientsService } from 'src/app/services/clients.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss'],
})
export class EditClientComponent {
  editUserForm: FormGroup;
  editUserAdvancedForm: FormGroup;
  advancedMode = false;
  modeText = 'Avanzado';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditClientComponent>,
    private toast: ToastrService,
    private _client: ClientsService,
    private _global: GlobalService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      startDate: string;
      endDate: string;
      hasPaid: boolean;
      name: string;
      plan: string;
      monthlyPayment: number;
    }
  ) {
    this.editUserForm = this.fb.group({
      startDate: [this.data.startDate, Validators.required],
      endDate: [this.data.endDate, Validators.required],
      hasPaid: [this.data.hasPaid],
    });

    this.editUserAdvancedForm = this.fb.group({
      startDate: [this.data.startDate, Validators.required],
      endDate: [this.data.endDate, Validators.required],
      hasPaid: [this.data.hasPaid],
      plan: [this.data.plan, Validators.required],
      monthlyPayment: [this.data.monthlyPayment, Validators.required],
      reasonForChanges: ['', Validators.required],
    });
  }

  get hasPaidValue(): boolean {
    return this.editUserForm.get('hasPaid').value;
  }

  switchMode(): void {
    this.advancedMode = !this.advancedMode;
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      const user = {
        data: {
          startDate: this.editUserForm.value['startDate'],
          endDate: this.editUserForm.value['endDate'],
          hasPaid: this.editUserForm.value['hasPaid'],
        },
      };

      // this._client
      //   .getUserByName(this.data.name)
      //   .pipe(
      //     switchMap((res: ClientModel) => {
      //       return this._client.makePayment(user, res.data[0].id);
      //     })
      //   )
      //   .subscribe(() => {
      //     this._global.updateUserUpdated(true);
      //     this.toast.success('Usuario actualizado', 'Exito');
      //     this.dialogRef.close();
      //   });
    }
  }
  onAdvancedSubmit(): void {
    if (this.editUserForm.valid) {
      const user = {
        data: {
          startDate: this.editUserAdvancedForm.value['startDate'],
          endDate: this.editUserAdvancedForm.value['endDate'],
          hasPaid: this.editUserAdvancedForm.value['hasPaid'],
          plan: this.editUserAdvancedForm.value['plan'],
          monthlyPayment: this.editUserAdvancedForm.value['monthlyPayment'],
          reasonForChanges: this.editUserAdvancedForm.value['reasonForChanges'],
        },
      };

      // this._client
      //   .getUserByName(this.data.name)
      //   .pipe(
      //     switchMap((res: ClientModel) => {
      //       return this._client.makePayment(user, res.data[0].id);
      //     })
      //   )
      //   .subscribe(() => {
      //     this._global.updateUserUpdated(true);
      //     this.toast.success('Usuario actualizado', 'Exito');
      //     this.dialogRef.close();
      //   });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
