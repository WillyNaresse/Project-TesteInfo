import { Component, OnInit } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable, startWith, map, finalize } from 'rxjs';
import { provideNgxMask, NgxMaskDirective } from 'ngx-mask';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleMetadata } from '../../models/vehicle.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-registry',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatButtonModule, MatIconModule, MatProgressBarModule, AsyncPipe, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss'
})
export class RegistryComponent implements OnInit {
  currentYear = new Date().getFullYear();

  form = new FormGroup({
    model: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    brand: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    year: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.min(1886), Validators.max(this.currentYear + 1)],
    }),
    plateNumber: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(7)],
    }),
    renavam: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(11)],
    }),
    vin: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(17)],
    }),
  });


  filteredModels!: Observable<string[]>;
  filteredBrands!: Observable<string[]>;

  vehicleMetadata!: VehicleMetadata;

  isEditting: boolean = false;
  isLoadingSubmit: boolean = false;
  vehicleId: string | null = null;

  constructor(private vehicleService: VehicleService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getMetadata();

    this.vehicleId = this.route.snapshot.paramMap.get('id');

    if (this.vehicleId) {
      this.loadVehicleData(this.vehicleId);
    }
  }

  private loadVehicleData(id: string): void {
    this.vehicleService.getById(id).subscribe(vehicle => {
      this.form.patchValue({
        ...vehicle,
        year: String(vehicle.year)
      })
    })

    this.isEditting = true
  }

  private getMetadata() {
    this.vehicleService.getMetadata().subscribe({
      next: vehicleMetadata => {
        this.vehicleMetadata = vehicleMetadata

        this.filteredModels = this.createAutocomplete(
          this.form.controls.model,
          this.vehicleMetadata.models
        );

        this.filteredBrands = this.createAutocomplete(
          this.form.controls.brand,
          this.vehicleMetadata.brands
        );
      },
      error: err => {
        console.error(err);
      }
    })
  }

  private createAutocomplete(
    control: FormControl<string>,
    options: string[]
  ): Observable<string[]> {
    return control.valueChanges.pipe(
      startWith(control.value),
      map(value => this.filter(value, options))
    );
  }

  private filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue()

    const vehicle = {
      ...formValue,
      year: Number(formValue.year)
    }

    const submitRequest = this.isEditting ? this.vehicleService.update(vehicle, this.vehicleId!) : this.vehicleService.create(vehicle)

    this.isLoadingSubmit = true

    submitRequest.pipe(
      finalize(() => {
        this.isLoadingSubmit = false
      })
    ).subscribe({
      next: () => {
        this.toastr.success(`Veículo ${this.isEditting ? 'atualizado' : 'cadastrado'} com sucesso!`, '', { timeOut: 4000})
        this.router.navigate(['/'])
      },
      error: err => {
        this.toastr.error('Algo deu errado. Tente novamente em instantes.', 'Oh-ohh!', { timeOut: 4000})
        console.error(err)
      }
    })
  }

  public inputTransformFn = (value: unknown): string =>
    typeof value === 'string' ? value.toUpperCase() : String(value);

  public outputTransformFn = (value: string | number | null | undefined): string => {
    return value ? String(value).toUpperCase() : ''
  };
}
