import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, merge, of, startWith } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { Flight } from '../../model/flight.model';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormSubmitButtonComponent } from '../form-submit-button/form-submit-button.component';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FlightCardComponent, FormInputComponent, FormSubmitButtonComponent, BrandLogoComponent],
  templateUrl: './flight-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly flightService = inject(FlightService);

  private readonly allFlights = signal<Flight[]>([]);

  readonly matchingFlights = signal<Flight[]>([]);
  readonly loading = signal(false);
  readonly hasSearched = signal(false);
  readonly canSearch = signal(false);

  readonly flightForm = this.fb.nonNullable.group({
    origin: ['', [Validators.required, Validators.minLength(2)]],
    destination: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly originControl = this.flightForm.controls.origin;
  readonly destinationControl = this.flightForm.controls.destination;

  constructor() {
    this.bindFrontendApiError(this.originControl, () => {
      if (!this.originControl.touched) return null;
      if (this.originControl.hasError('required')) return 'Indica el origen del viaje';
      return null;
    });

    this.bindFrontendApiError(this.destinationControl, () => {
      if (!this.destinationControl.touched) return null;
      if (this.destinationControl.hasError('required')) return 'Indica el destino del viaje';
      return null;
    });

    this.bindSearchState();
    this.updateCanSearch();
  }

  private bindFrontendApiError(control: FormControl<string>, getMessage: () => string | null): void {
    merge(control.statusChanges, control.valueChanges)
      .pipe(startWith(null), takeUntilDestroyed())
      .subscribe(() => this.setFrontendApiError(control, getMessage()));
  }

  private setFrontendApiError(control: FormControl<string>, message: string | null): void {
    const errors = control.errors ?? {};
    const source = errors['apiErrorSource'];
    const current = errors['apiError'];

    if (message) {
      if (source === 'frontend' && current === message) return;
      control.setErrors({ ...errors, apiError: message, apiErrorSource: 'frontend' });
      return;
    }

    if (source === 'frontend') {
      const { apiError, apiErrorSource, ...rest } = errors;
      control.setErrors(Object.keys(rest).length ? rest : null);
    }
  }

  private bindSearchState(): void {
    this.flightForm.statusChanges.pipe(startWith(this.flightForm.status), takeUntilDestroyed()).subscribe(() => {
      this.updateCanSearch();
    });

    this.flightForm.valueChanges.pipe(startWith(this.flightForm.getRawValue()), takeUntilDestroyed()).subscribe(() => {
      this.updateCanSearch();
    });
  }

  private updateCanSearch(): void {
    this.canSearch.set(this.flightForm.valid && !this.loading());
  }

  onSearch(): void {
    if (this.flightForm.invalid) return;

    this.hasSearched.set(true);
    this.loading.set(true);
    this.updateCanSearch();

    const { origin, destination } = this.flightForm.getRawValue();
    const originQuery = origin.trim().toLowerCase();
    const destinationQuery = destination.trim().toLowerCase();

    this.filterFlights(originQuery, destinationQuery);
    this.loading.set(false);
    this.updateCanSearch();
  }

  ngOnInit(): void {
    this.loading.set(true);
    this.updateCanSearch();

    this.flightService
      .getflights()
      .pipe(
        catchError((error) => {
          console.error('Error loading flights', error);
          return of([] as Flight[]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((flights: Flight[]) => {
        this.allFlights.set(flights);
        this.matchingFlights.set(flights);
        this.updateCanSearch();
      });
  }

  private filterFlights(originQuery: string, destinationQuery: string): void {
    const filteredFlights = this.allFlights().filter((flight) => {
      const flightOrigin = flight.origin.toLowerCase();
      const flightDestination = flight.destination.toLowerCase();
      const flightId = flight.id.toLowerCase();

      return (
        (flightOrigin.includes(originQuery) || flightId.includes(originQuery)) &&
        (flightDestination.includes(destinationQuery) || flightId.includes(destinationQuery))
      );
    });

    this.matchingFlights.set(filteredFlights);
  }
}











