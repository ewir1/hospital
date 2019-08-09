import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert2';
import { Medico } from 'app/models/medico.model';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  totalMedicos = 0;
  urlBase = environment.urlBase;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService,
    public router: Router
  ) { }

  cargarMedicos(desde: number = 0) {
    const url = this.urlBase + '/medico?desde=' + desde;
    return this.http.get(url);
  }

  buscarMedicos(termino: string) {
    const url = this.urlBase + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.medicos));
  }

  borrarMedico(medico: Medico) {
    let url = this.urlBase + '/medico/' + medico._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => resp));
  }

  crearMedico(nombre: string, email: string, img: string, hospital: string, telefono: string, sexo: boolean) {
    let url = this.urlBase + '/medico';
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, { nombre, email, img, hospital, telefono, sexo })
      .pipe(map((resp: any) => {
        return resp.hospital;
      }),
      catchError(err => {
        console.error(err);
        swal.fire('Correo ya registrado', `<b>${err.error.errors.errors.email.value}</b> ya se encuentra registrado!` , 'error');
        return throwError(err);
      }));
  }

  actualizarMedico(medico: Medico) {
    let url = this.urlBase + '/medico/' + medico._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, medico)
      .pipe(map((resp: any) => {
        swal.fire('Médico actualizado', medico.nombre, 'success');
        return resp.medico;
      }));
  }

  // guardarMedico(medico: Medico) {
  //   let url = this.urlBase + '/medico';

  //   if (medico._id) {
  //     // Actualizando
  //     url += '/' + medico._id;
  //     url += '?token=' + this._usuarioService.token;
  //     return this.http.put(url, medico)
  //       .pipe(map((resp: any) => {
  //         swal.fire('Medico Acualizado', medico.nombre, 'success');
  //         return resp.medico;
  //       }));
  //   } else {
  //     // Creando
  //     url += '?token=' + this._usuarioService.token;
  //     return this.http.post(url, medico)
  //       .pipe(map((resp: any) => {
  //         swal.fire('Medico Creado', medico.nombre, 'success');
  //         return resp.medico;
  //       }));
  //   }
  // }

  obtenerMedico(id: string) {
    const url = this.urlBase + '/medico/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => {
        return resp.medico;
      }));
  }

}
