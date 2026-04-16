import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Flight } from '../../model/flight.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightCardComponent {
  // SIGNAL INPUT: Es obligatorio (required) y de tipo Flight
  flight = input.required<Flight>();

  // SIGNAL OUTPUT: Avisa al padre que el usuario ha reservado este vuelo
  onReserve = output<Flight>();

  getCityName(code: string): string {
    
    const cities: { [key: string]: string } = {
      BCN: 'Barcelona',
      ORY: 'París Orly',
      FCO: 'Roma Fiumicino',
      AMS: 'Ámsterdam',
      LGW: 'Londres Gatwick',
      CDG: 'París Charles de Gaulle',
      LIS: 'Lisboa',
      BRU: 'Bruselas',
      DUB: 'Dublín',
      ZRH: 'Zúrich',
      BER: 'Berlín',
    };
    return cities[code] || code; // Si no encuentra el código, muestra la sigla original
  }
  booking() {
    // Emitimos el valor actual del signal input hacia el padre
    this.onReserve.emit(this.flight());
  }
}
