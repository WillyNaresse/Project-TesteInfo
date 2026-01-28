import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { finalize } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatProgressSpinnerModule, MatTableModule, MatIconModule, MatSortModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButton],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'model', 'brand', 'year', 'plateNumber', 'renavam', 'vin', 'actions'];

  vehicles = new MatTableDataSource<Vehicle>([]);

  isLoadingVehicles: boolean = false;

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (paginator) {
      this.vehicles.paginator = paginator;
    }
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (sort) {
      this.vehicles.sort = sort;
    }
  }

  constructor(private vehicleService: VehicleService, private toastr: ToastrService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllVehicles()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.vehicles.filter = filterValue.trim().toLowerCase();

    if (this.vehicles.paginator) {
      this.vehicles.paginator.firstPage();
    }
  }

  private getAllVehicles(): void {
    this.isLoadingVehicles = true

    this.vehicleService.getAll().pipe(
      finalize(() => {
        this.isLoadingVehicles = false
      })
    ).subscribe({
      next: vehicles => {
        this.vehicles.data = vehicles;
      },
      error: err => {
        this.toastr.error('Algo deu errado. Tente novamente em instantes.', 'Oh-ohh!', { timeOut: 4000})
        console.error(err)
      }
    });
  }

  editVehicle(id: string): void {
    this.router.navigate([`/registry/${id}`])
  }

  deleteVehicle(id: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        title: 'Excluir veículo',
        message: 'Tem certeza que deseja excluir este veículo?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        iconName: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.vehicleService.delete(id).subscribe({
          next: () => {
            this.toastr.success('Veículo excluido.', '', { timeOut: 4000})
            this.getAllVehicles()
          },
          error: err => {
            this.toastr.error('Algo deu errado. Tente novamente em instantes.', 'Oh-ohh!', { timeOut: 4000})
            console.error(err)
          }
        })
      }
    });
  }
}
