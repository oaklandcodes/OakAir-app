import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-flight-search',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.css',
})
export class FlightSearchComponent implements OnInit {
  // 1. Declaramos el formGroup (contenedor)
  flightForm = new FormGroup({
    origin: new FormControl(''),
    destination: new FormControl(''),
    passengers: new FormControl(1),
  });

  ngOnInit(): void {
    // 2. Inicializamos el formGroup con validaciones
    this.flightForm = new FormGroup({
      origin: new FormControl('', [Validators.required, Validators.minLength(3)]),
      destination: new FormControl('', [Validators.required, Validators.minLength(3)]),
      passengers: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(9)]),
    });
  }

//   form = this.fb.group({
//   origin: ['', [Validators.required, Validators.minLength(3)]],
//   destination: ['', [Validators.required, Validators.minLength(3)]],
//   passengers: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
// });

  search(){
    if(this.flightForm.valid){
      console.log('Buscando vuelos con:', this.flightForm.value);
      // Aquí podrías llamar a un servicio para obtener los vuelos
    } else {
      console.log('Formulario no válido');
    }
  }


}
