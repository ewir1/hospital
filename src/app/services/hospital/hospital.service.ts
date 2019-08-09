import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert2';
import { Hospital } from 'app/models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales = 0;
  urlBase = environment.urlBase;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService) { }


  cargarHospitales(desde: number = 0) {
    const url = this.urlBase + '/hospital?desde=' + desde;
    return this.http.get(url);
    //  .pipe(map((resp: any) => {
    //   this.totalHospitales = resp.total;
    //   return resp.hospitales;
    // }));
  }

  borrarHospital(id: string) {
    let url = this.urlBase + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        return true;
      }));
  }

  crearHospital(nombre: string, img: string, estado: string, ciudad: string, lat: string, lng: string) {
    let url = this.urlBase + '/hospital';
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, { nombre, img, estado, ciudad, lat, lng })
      .pipe(map((resp: any) => resp.hospital));
  }

  buscarHospital(termino: string) {
    const url = this.urlBase + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.hospitales));
  }

  actualizarHospital(hospital: Hospital) {
    let url = this.urlBase + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, hospital)
      .pipe(map((resp: any) => {
        swal.fire('Hospital Actualizado', hospital.nombre, 'success');
        return resp.hospital;
      }));
  }

  // cargarHospital(id: string) {
  //   const url = this.urlBase + '/hospital/' + id;
  //   return this.http.get(url)
  //     .pipe(map((resp: any) =>  resp.hospital));
  // }

  obtenerHospital(id: string) {
    const url = this.urlBase + '/hospital/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.hospital));
  }

}
