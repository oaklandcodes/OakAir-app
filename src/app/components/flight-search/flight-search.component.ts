import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { FlightService } from '../../services/flight.service';
import { Flight } from '../../model/flight.model';
import { RouterLink } from '@angular/router';
import { FlightCardComponent } from "../flight-card/flight-card.component";

@Component({
  selector: 'app-flight-search',
  imports: [ReactiveFormsModule, FlightCardComponent],
  templateUrl: './flight-search.html',
})
export class FlightSearchComponent implements OnInit {
  
  //1. Inyecciones necesarias con inject
  private fb = inject(FormBuilder);
  private flightService = inject(FlightService);

  //2.Signal para los vuelos que vienen de la API
  searchAllFlights = signal<Flight[]>([]);
  loading = signal(false);

  //3. Formulario reactivo
  flightForm: FormGroup = this.fb.group({
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    passengers: [1, [Validators.required, Validators.min(1)]],
    date: ['', Validators.required],
  });

  //4. Método para manejar la búsqueda
  onSearch() {
    if (this.flightForm.invalid) return;
    this.loading.set(true);

    // Extraemos los valores del formulario
    const { origin, destination } = this.flightForm.value as {
      origin: string;
      destination: string;
    };
    
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

 





