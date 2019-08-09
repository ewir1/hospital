import { Component, OnInit } from '@angular/core';
import { Hospital } from 'app/models/hospital.model';
import { Medico } from 'app/models/medico.model';
import { Paciente } from 'app/models/paciente.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  hospitales: Hospital[] = [];
  medicos: Medico[] = [];
  pacientes: Paciente[] = [];
  termino: string;

  constructor(
    public activateRoute: ActivatedRoute,
    public http: HttpClient
  ) {
    activateRoute.params.subscribe(params => {
      const termino = params['termino'];
      this.buscar(termino);
    })
  }

  ngOnInit() {
  }

  buscar(termino: string) {
    this.termino = termino;
    const url = environment.urlBase + '/busqueda/todo/' + termino;
    this.http.get(url)
        .subscribe((resp: any) => {
          this.hospitales = resp.hospitales;
          this.medicos = resp.medicos;
          this.pacientes = resp.pacientes;
          
        });
  }

}
