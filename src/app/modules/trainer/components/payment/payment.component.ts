import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription, switchMap } from 'rxjs';
import { Datum } from 'src/app/core/models/client.model';
import { GlobalService } from 'src/app/services/global.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  paymentRecordForm: FormGroup;
  editPaymentRecordForm: FormGroup;

  planSubscription!: Subscription;
  amountSubscription!: Subscription;
  discountSubscription!: Subscription;
  hasDiscount = false;
  today = new Date(); // Fecha de hoy
  dateFilter = (date: Date | null): boolean => {
    const today = new Date(); // Asegurarte que está en contexto
    today.setHours(0, 0, 0, 0); // Quitar las horas para comparar solo fechas
    return date ? date >= today : false;
  };

  constructor(
    private dialogRef: MatDialogRef<PaymentComponent>,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Datum,
    private _payment: PaymentService,
    private _global: GlobalService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listenForFormChanges();
  }

  listenForFormChanges() {
    this.planSubscription = this.paymentRecordForm
      .get('plan')
      ?.valueChanges.subscribe((value) => {
        const newAmountValue = value == '3 dias' ? '80000' : '120000';
        this.paymentRecordForm.get('amount')?.setValue(newAmountValue);
      });

    this.amountSubscription = this.paymentRecordForm
      .get('amount')
      ?.valueChanges.subscribe((value) => {
        const planValue = this.paymentRecordForm.get('plan')?.value;
        if (value == '80000') {
          this.validateDiscount();
          this.hasDiscount = false;
          if (planValue == '6 dias') {
            this.toast.error('No es el valor de el plan  elegido', 'Error');
            this.paymentRecordForm.get('amount')?.setValue('120000');
          }
        }
        if (value == '120000') {
          this.validateDiscount();
          this.hasDiscount = false;
          if (planValue == '3 dias') {
            this.toast.error('No es el valor de el plan  elegido', 'Error');
            this.paymentRecordForm.get('amount')?.setValue('80000');
          }
        }
        if (value == 'otro') {
          this.validateDiscount();
          this.hasDiscount = true;
          this.paymentRecordForm
            .get('amount')
            ?.setValue('', { emitEvent: false });
        }
      });

    this.discountSubscription = this.paymentRecordForm
      .get('discountAmount')
      ?.valueChanges.subscribe(() => {
        const amount =
          this.paymentRecordForm.get('plan')?.value == '3 dias'
            ? '80000'
            : '120000';

        this.paymentRecordForm
          .get('amount')
          ?.setValue(amount, { emitEvent: false });
      });
  }

  cancel() {
    this.dialogRef.close();
  }

  validateDiscount(): void {
    const discountAmountControl = this.paymentRecordForm.get('discountAmount');
    const discountReasonControl = this.paymentRecordForm.get('discountReason');

    if (this.hasDiscount) {
      discountAmountControl?.setValidators([Validators.required]);
      discountReasonControl?.setValidators([Validators.required]);
    } else {
      discountAmountControl?.clearValidators();
      discountReasonControl?.clearValidators();
    }

    discountAmountControl?.updateValueAndValidity();
    discountReasonControl?.updateValueAndValidity();
  }

  initForm() {
    this.paymentRecordForm = this.formBuilder.group({
      paymentDate: ['', [Validators.required]],
      dueDate: [''],
      status: ['paid', [Validators.required]],
      plan: ['6 dias', [Validators.required]],
      amount: ['120000', [Validators.required]],
      hasDiscounted: [''],
      discountAmount: [''],
      discountReason: [''],
    });

    this.editPaymentRecordForm = this.formBuilder.group({
      status: ['paid', [Validators.required]],
    });
  }

  calcDueDate(dateString: string): string {
    const date = new Date(dateString);

    // Sumar un mes usando setMonth
    const currentDay = date.getDate(); // Guardamos el día actual
    date.setMonth(date.getMonth() + 1);

    // Verificar si el día actual no existe en el mes ajustado
    if (date.getDate() !== currentDay) {
      // Ajustar al último día del mes anterior
      date.setDate(0); // 0 en setDate() ajusta al último día del mes anterior
    }

    // Formatear la fecha en 'YYYY-MM-DD'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  submit() {
    if (this.paymentRecordForm.valid) {
      let formData = this.paymentRecordForm.getRawValue();
      formData.dueDate = this.calcDueDate(formData.paymentDate);
      formData.hasDiscounted = this.hasDiscount;
      this._payment
        .makePayment(formData, this.data.id)
        .pipe(
          switchMap(() => {
            const payload = {
              data: {
                endDate: formData.dueDate,
                plan: formData.plan,
                monthlyPayment: formData.amount,
                status: formData.status,
                discount: formData.hasDiscounted,
                discountAmount: formData.discountAmount,
                discountReason: formData.discountReason,
              },
            };
            return this._payment.updateClient(payload, this.data.id);
          })
        )
        .subscribe({
          next: () => {
            this.toast.success('Pago registrado', 'Exito');
            this.cancel();
            this._global.updateDataUpdated(true);
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }

  updatePaymentRecord() {
    const status = this.editPaymentRecordForm.get('status').value;
    const payload = {
      data: {
        status: status,
      },
    };
    this._payment
      .findPaymentRecord(this.data.id, this.data.attributes.endDate.toString()) // Buscar el registro de pago
      .pipe(
        switchMap((records: any) => {
          if (records && records.data.length > 0) {
            const paymentRecordId = records.data[0].id;
            return this._payment
              .updatePaymentRecord(paymentRecordId, status)
              .pipe(
                switchMap(() =>
                  this._payment.updateClient(payload, this.data.id)
                )
              ); // Actualizar el registro de pago
          } else {
            throw new Error(
              'No se encontró el registro de pago para el cliente y fecha especificados.'
            );
          }
        })
      )
      .subscribe({
        next: () => {
          this.toast.success('Pago registrado', 'Exito');
          this.cancel();
          this._global.updateDataUpdated(true);
        },
        error: (err) => {
          this.toast.error('Error al registrar el pago', 'Error');
        },
      });
  }
}
