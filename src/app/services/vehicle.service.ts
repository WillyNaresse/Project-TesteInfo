import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Vehicle, VehicleMetadata } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly API = `${environment.apiUrl}/vehicles`

  constructor(private http: HttpClient) { }

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.API)
  }

  getById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.API}/${id}`)
  }

  create(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.API, vehicle)
  }

  update(vehicle: Vehicle, id: string): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.API}/${id}`, vehicle)
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`)
  }

  getMetadata(): Observable<VehicleMetadata> {
    return this.getAll().pipe(
      map(vehicles => {
        const vehicleMetadata: VehicleMetadata = {
          brands: [],
          models: []
        }
        vehicles.forEach(vehicle => {
          vehicleMetadata.brands.push(vehicle.brand)
          vehicleMetadata.models.push(vehicle.model)
        })

        vehicleMetadata.brands.sort()
        vehicleMetadata.models.sort()

        return vehicleMetadata
      })
    )
  }
}
