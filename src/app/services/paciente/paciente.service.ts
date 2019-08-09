import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { Paciente } from 'app/models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  totalPacientes = 0;
  urlBase = environment.urlBase;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarPacientes() {
    const url = this.urlBase + '/paciente';
    return this.http.get(url);
  }

  obtenerPaciente(id: string) {
    const url = this.urlBase + '/paciente/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => {
        return resp.paciente;
      }));
  }

  crearPaciente(nombre: string, email: string, telefono: string, edad: number,
    fnacimiento: string, tsangre: string, hospital: string, medico: string, sexo: boolean) {
    let url = this.urlBase + '/paciente';
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, { nombre, email, telefono, edad, fnacimiento, tsangre, hospital, medico, sexo })
      .pipe(map((resp: any) => {
        return resp.hospital;
      }),
        catchError(err => {
          Swal.fire('Correo ya registrado', `<b>${err.error.errors.errors.email.value}</b> ya se encuentra registrado!`, 'error');
          return throwError(err);
        }));
  }

  actualizarPaciente(paciente: Paciente) {
    let url = this.urlBase + '/paciente/' + paciente._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, paciente)
      .pipe(map((resp: any) => {
        Swal.fire('Paciente actualizado', paciente.nombre, 'success');
        return resp.paciente;
      }));
  }

  borrarPaciente(paciente: Paciente) {
    let url = this.urlBase + '/paciente/' + paciente._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        return resp.paciente;
      }));
  }
}
