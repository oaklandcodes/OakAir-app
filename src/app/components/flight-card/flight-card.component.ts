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

  booking() {
    // Emitimos el valor actual del signal input hacia el padre
    this.onReserve.emit(this.flight());
  }
}
