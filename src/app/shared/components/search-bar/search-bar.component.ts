import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  animations: [
    trigger('filterAnimation', [
      transition(':enter', [
        style({
          transform: 'translateY(-70px)',
          opacity: 0,
        }),
        animate(
          '300ms ease-out',
          style({
            transform: 'translateY(0)',
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({
            transform: 'translateY(-70px)',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class SearchBarComponent implements OnInit {
  showFilters = false;

  searchTerm = '';
  filterTrainer = '';
  filterDate: Date | null = null;
  filterAge: number | null = null;
  filtersForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  initForm() {
    this.filtersForm = this.formBuilder.group({
      trainer: [''],
      fortNight: [''],
      status: [''],
      plan: [''],
      discount: [false],
      discountReason: [''],
    });
  }

  onSearch() {
    console.log({
      search: this.searchTerm,
      trainer: this.filterTrainer,
      date: this.filterDate,
      age: this.filterAge,
    });
  }

  applyFilters() {}
}
