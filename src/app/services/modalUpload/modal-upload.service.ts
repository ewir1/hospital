import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  constructor() { }


  closeSaveModal() {
    setTimeout(() => {
      const cerrarModal = document.querySelector('.modal-cargado');
      cerrarModal.classList.remove('show');
      cerrarModal.classList.add('cerrar-modal');
      document.querySelector('.modal-backdrop').classList.remove('modal-backdrop');
      document.querySelector('.modal-backdrop').classList.remove('fade');
      document.querySelector('.modal-backdrop').classList.remove('show');
    }, 1000);
  }

  subirArchivo(archivo: File, tipo: string, id: string) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('imagen', archivo, archivo.name);

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log('Imagen Subida');
            resolve(JSON.parse(xhr.response))
          } else {
            console.log('Falló la subida');
            reject(JSON.parse(xhr.response));
          }
        }
      };

      const url = environment.urlBase + `/upload/${tipo}/${id}`;
      xhr.open('PUT', url, true);
      xhr.send(formData);
    });
  }

}
