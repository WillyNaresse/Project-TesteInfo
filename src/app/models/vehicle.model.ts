export interface Vehicle {
  id?: string
  brand: string
  model: string
  year: number
  plateNumber: string
  renavam: string
  vin: string
}

export interface VehicleMetadata {
  brands: string[],
  models: string[]
}
