import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Datum } from 'src/app/core/models/client.model';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss'],
})
export class AssessmentComponent implements OnInit {
  searchText: string = '';
  filteredOptions: Datum[] = [];
  bodyMeasurementsForm: FormGroup;
  userSelected: Datum;

  constructor(
    private dialogRef: MatDialogRef<AssessmentComponent>,
    private formBuilder: FormBuilder,
    private _assessment: AssessmentService,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Datum
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.bodyFatPercentageCalc();
  }

  initForm() {
    this.bodyMeasurementsForm = this.formBuilder.group({
      date: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      height: ['', [Validators.required]],
      chest: ['', [Validators.required]],
      abdomen: ['', [Validators.required]],
      leftArm: ['', [Validators.required]],
      rightArm: ['', [Validators.required]],
      glutes: ['', [Validators.required]],
      leftThigh: ['', [Validators.required]],
      rightThigh: ['', [Validators.required]],
      leftCalf: ['', [Validators.required]],
      rightCalf: ['', [Validators.required]],
      chestFold: [''],
      midaxillaryFold: [''],
      subscapularisFold: [''],
      bicepFold: [''],
      tricepFold: [''],
      abdomenFold: [''],
      suprailiacFold: [''],
      thighFold: [''],
      calfFold: [''],
      bodyFatPercentage: [{ value: '', disabled: true }],
    });
  }

  submit() {
    if (this.bodyMeasurementsForm.valid) {
      const formData = this.bodyMeasurementsForm.getRawValue();
      this._assessment.createMeasurement(formData, this.data.id).subscribe({
        next: () => {
          this.toast.success('Medidas registradas', 'Exito');
          this.cancel;
        },
        error: () => {
          this.toast.error('Error al guardar las medidas', 'Error');
        },
      });
    }
  }

  cancel() {
    this.dialogRef.close(); // Solo cierra el modal sin enviar datos
  }

  bodyFatPercentageCalc() {
    this.bodyMeasurementsForm.valueChanges.subscribe(() => {
      const gender = this.data.attributes.gender;
      const birthDate = this.data.attributes.birthDate;
      const age = this.getUserAge(birthDate);
      const chestFold = parseFloat(
        this.bodyMeasurementsForm.value['chestFold']
      );
      const midaxillaryFold = parseFloat(
        this.bodyMeasurementsForm.value['midaxillaryFold']
      );
      const subscapularisFold = parseFloat(
        this.bodyMeasurementsForm.value['subscapularisFold']
      );
      const bicepFold = parseFloat(
        this.bodyMeasurementsForm.value['bicepFold']
      );
      const tricepFold = parseFloat(
        this.bodyMeasurementsForm.value['tricepFold']
      );
      const abdomenFold = parseFloat(
        this.bodyMeasurementsForm.value['abdomenFold']
      );
      const suprailiacFold = parseFloat(
        this.bodyMeasurementsForm.value['suprailiacFold']
      );
      const thighFold = parseFloat(
        this.bodyMeasurementsForm.value['thighFold']
      );
      const calfFold = parseFloat(this.bodyMeasurementsForm.value['calfFold']);
      let foldSum =
        chestFold +
        midaxillaryFold +
        subscapularisFold +
        bicepFold +
        tricepFold +
        abdomenFold +
        suprailiacFold +
        thighFold +
        calfFold;

      const bfp = this.bftCalc(age, foldSum, gender);
      this.bodyMeasurementsForm
        .get('bodyFatPercentage')
        ?.setValue(bfp, { emitEvent: false });
    });
  }

  bftCalc(age: number, foldSum: number, gender: string) {
    foldSum = foldSum ? foldSum : 0;
    let bfp = 0;
    if (gender == 'Masculino') {
      const formula =
        1.112 -
        0.00043499 * foldSum +
        0.00000055 * foldSum ** 2 -
        0.00028826 * age;

      bfp = 495 / formula - 450;
    } else {
      const formula =
        1.097 -
        0.00046971 * foldSum +
        0.00000056 * foldSum ** 2 -
        0.00028826 * age;
      bfp = 495 / formula - 450;
    }
    return bfp.toFixed(2);
  }

  getUserAge(birthDate: Date) {
    const hoy = new Date();
    const formatedDate = new Date(birthDate);

    let edad = hoy.getFullYear() - formatedDate.getFullYear();

    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    if (
      mesActual < formatedDate.getMonth() ||
      (mesActual === formatedDate.getMonth() &&
        diaActual < formatedDate.getDate())
    ) {
      edad--;
    }

    return edad;
  }

  onSelect(option: Datum): void {
    // Seleccionar una opción
    this.searchText = option.attributes.name;
    this.userSelected = option;
    this.filteredOptions = []; // Limpiar la lista
  }
}
