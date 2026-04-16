export interface Flight {
  id: string;
  origin: string;
  destination: string;
  price: number;
  date: string;
}

// En flight.model.ts o arriba en tu componente
export interface FlightJournal {
  dest: string;
  date: string;
  aircraft: string;
  status: 'COMPLETED' | 'CANCELLED' | 'SCHEDULED';
}