

import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  urlBase = environment.urlBase;

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    // public _subirArchivoService: SubirArchivoService
    ) {
    // console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  renuevaToken() {
    let url = this.urlBase + '/login/renuevatoken';
    url += '?token=' + this.token;
    return this.http.get(url)
      .pipe(map((resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);
        return true;
      }),
        catchError(err => {
          this.router.navigate(['/login']);
          swal.fire('No se pudo renovar token', 'No fue posible renovar token', 'error');
          return throwError(err);
        }));
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  loginGoogle(token: string) {
    const url = this.urlBase + '/login/google';
    return this.http.post(url, { token })
      .pipe(map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      }));
  }

  login(usuario: Usuario, recordar = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = this.urlBase + '/login';
    return this.http.post<Usuario>(url, usuario)
      .pipe(map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      }),
        catchError(err => {
          swal.fire('Error en el login', err.error.mensaje, 'error');
          return throwError(err);
        }));
  }

  crearUsuario(usuario: Usuario) {
    const url = this.urlBase + '/usuario';
    return this.http.post<Usuario>(url, usuario)
      .pipe(map((resp: any) => {
        swal.fire('Usuario creado', usuario.email, 'success');
        return resp.usuario;
      }),
        catchError(err => {
          swal.fire(err.error.mensaje, 'Este email ya existe!', 'error');
          return throwError(err);
        }));
  }

  actualizarUsuario(usuario: Usuario) {
    let url = this.urlBase + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put<Usuario>(url, usuario)
      .pipe(map((resp: any) => {
        // this.usuario = resp.usuario;
        if (usuario._id === this.usuario._id) {
          const usuarioDB: Usuario = resp.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
        }
        swal.fire('Usuario Actualizado', usuario.nombre, 'success');
        return true;
      }),
        catchError(err => {
          swal.fire(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }

  // cambiarImagen(archivo: File, id: string) {
  //   this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
  //     .then((resp: any) => {
  //       this.usuario.img = resp.usuarioActualizado.img;
  //       swal.fire('Imagen Actualizada', this.usuario.nombre, 'success');
  //       this.guardarStorage(id, this.token, this.usuario, this.menu);
  //     })
  //     .catch(resp => {
  //       console.log(resp);
  //     });
  // }

  cargarUsuarios(desde: number = 0) {
    const url = this.urlBase + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = this.urlBase + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.usuarios));
  }

  borrarUsuario(id: string) {
    let url = this.urlBase + '/usuario/' + id;
    url += '?token=' + this.token;
    return this.http.delete(url)
      .pipe(map(resp => {
        swal.fire('Usuario Borrado', 'El usuario ha sido eliminado correctamente', 'success');
        return true;
      }));
  }

}
