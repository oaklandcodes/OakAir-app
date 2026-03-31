import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
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

  //1. Inyecciones necesarias con inject
  private readonly fb = inject(FormBuilder);
  private readonly flightService = inject(FlightService);

  //2.Signal para los vuelos que vienen de la API
  readonly searchAllFlights = signal<Flight[]>([]);
  readonly loading = signal(false);
  readonly hasSearched = signal(false);

  //3. Formulario reactivo
  readonly flightForm = this.fb.nonNullable.group({
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    passengers: [1, [Validators.required, Validators.min(1)]],
    date: ['', Validators.required],
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

  readonly canSearch = computed(() => this.flightForm.valid && !this.loading());

  //4. Método para manejar la búsqueda
  onSearch(): void {
    if (this.flightForm.invalid) return;
    this.hasSearched.set(true);
    this.loading.set(true);

    // Extraemos los valores del formulario
    const { origin, destination } = this.flightForm.getRawValue();
    
  //Llamamos al servicio para obtener los vuelos (aqui practicamos el filtrado)
 
    this.flightService
      .getflights()
      .pipe(
        catchError((error) => {
          console.error('Error al cargar vuelos', error);
          return of([] as Flight[]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((vuelos: Flight[]) => {
        const filteredFlights = vuelos.filter(
          (flight: Flight) =>
            flight.origin.toLowerCase() === origin.toLowerCase() &&
            flight.destination.toLowerCase() === destination.toLowerCase(),
        );
        this.searchAllFlights.set(filteredFlights);
      });

  }

  ngOnInit(): void {
    //5. Cargamos todos los vuelos al iniciar el componente
    this.flightService.getflights().subscribe((flightsList) => {
      this.searchAllFlights.set(flightsList);
      this.loading.set(false);
    });
  }
}











