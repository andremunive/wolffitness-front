import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ClientsService } from 'src/app/services/clients.service';
import { ActivatedRoute } from '@angular/router';
import { Datum, SingleCLient } from 'src/app/core/models/client.model';
import { switchMap } from 'rxjs';
import { PaymentService } from 'src/app/services/payment.service';
import {
  PaymentRecord,
  PaymentRecordResponse,
} from 'src/app/core/models/payment-record.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import {
  BodyMeasurementRecord,
  BodyMeasurementResponse,
} from 'src/app/core/models/measurement.mode';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss'],
})
export class ClientProfileComponent implements OnInit {
  clientId!: string;
  client: Datum;
  payments: PaymentRecord[];
  measurements: BodyMeasurementRecord[];
  constructor(
    private location: Location,
    private _client: ClientsService,
    private route: ActivatedRoute,
    private _payment: PaymentService,
    private _measurements: AssessmentService
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('clientId');
    this.getClientInfo();
  }

  getClientInfo() {
    this._client
      .getUserById(this.clientId)
      .pipe(
        switchMap((response: SingleCLient) => {
          this.client = response.data;
          return this._payment.getLastThreePayments(this.clientId).pipe(
            switchMap((response: PaymentRecordResponse) => {
              this.payments = response.data;
              return this._measurements.getLastThreeMeasurements(this.clientId);
            })
          );
        })
      )
      .subscribe({
        next: (response: BodyMeasurementResponse) => {
          this.measurements = response.data;
        },
        error: (err) => {
          console.error('Error occurred: ', err);
        },
      });
  }

  goBack() {
    this.location.back();
  }
}
