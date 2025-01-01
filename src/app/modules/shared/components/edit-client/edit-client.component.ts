import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Datum } from 'src/app/core/models/client.model';
import { ClientsService } from 'src/app/services/clients.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss'],
})
export class EditClientComponent implements OnInit {
  editUserForm: FormGroup;
  genders = [
    { value: 'male', viewValue: 'Masculino' },
    { value: 'female', viewValue: 'Femenino' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Datum,
    private _client: ClientsService,
    private toast: ToastrService,
    private _global: GlobalService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.editUserForm = this.fb.group({
      fullName: [
        this.data?.attributes.name,
        [Validators.required, Validators.minLength(3)],
      ],
      gender: [this.data?.attributes.gender, Validators.required],
      birthDate: [this.data?.attributes.birthDate, Validators.required],
      email: [
        this.data?.attributes.email,
        [Validators.required, Validators.email],
      ],
      whatsapp: [
        this.data?.attributes.whatsapp,
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
    });
  }

  submit() {
    if (this.editUserForm.valid) {
      let formData = this.editUserForm.getRawValue();
      const payload = {
        data: {
          ...formData,
        },
      };
      this._client.updateClient(payload, this.data?.id).subscribe({
        next: () => {
          this.toast.success('Usuario actualizado', 'Exito');
          this.cancel();
          this._global.updateDataUpdated(true);
        },
      });
    }
  }

  cancel() {
    this.dialogRef.close(); // Solo cierra el modal sin enviar datos
  }
}
