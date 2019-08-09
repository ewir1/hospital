import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'app/services/hospital/hospital.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Medico } from 'app/models/medico.model';
import { Location } from '@angular/common';
import { MedicoService } from 'app/services/medico/medico.service';
import { Hospital } from 'app/models/hospital.model';
import Swal from 'sweetalert2';
import { tileLayer, latLng, circle, polygon, marker, icon } from 'leaflet';
import { ModalUploadService } from 'app/services/modalUpload/modal-upload.service';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {

  hospital: Hospital;
  medicos: Medico[] = [];
  imagenSubir: File;
  imagenTemp: any;
  id: string;

  liteLayer = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  apiKey: 'bfd281d5ef1745a189c5c103b01fa2cf'
  tileLayer: any = tileLayer(`${this.liteLayer}?apikey${this.apiKey}`, { maxZoom: 18, attribution: '...' });

  options: any;

  layersControl = {
    baseLayers: {
      'Abrir el mapa de calles': tileLayer(`${this.liteLayer}`, { maxZoom: 18, attribution: '...' }),
      'Mapa de Ciclo Abierto': tileLayer(`http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png`,
      { maxZoom: 18, attribution: '...' })
    },
    overlays: {
      'Circulo Grande': circle([46.95, -122], { radius: 5000 }),
      'Cuadro Grande': polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]])
    }
  }

  medicosTotal: number;
  hospitalId: string;

  constructor(
    public _hospitalService: HospitalService,
    public _medicoService: MedicoService,
    public router: Router,
    public activatedRouter: ActivatedRoute,
    public _modalUploadService: ModalUploadService,
    public location: Location
  ) {
    activatedRouter.params.subscribe(params => {
      const id = params['id'];
      if (id !== 'hospital') {
        this.verHospital(id);
      }
    })
  }

  ngOnInit() {
    this.totalMedicos();
  }

  verHospital(id: string) {
    this._hospitalService.obtenerHospital(id)
      .subscribe(hospital => {
        if (hospital.coords) {
          this.options = {
            layers: [
              this.tileLayer,
              marker([hospital.coords.lat, hospital.coords.lng],
                {
                  icon: icon({
                    iconSize: [25, 41],
                    iconAnchor: [12, 4],
                    iconUrl: 'assets/img/marker.png'
                  })
                }
              )
              .bindPopup(`${hospital.nombre}`).openTooltip()
            ],
            zoom: 16,
            center: latLng(hospital.coords.lat, hospital.coords.lng)
          };
        }
       this.hospital = hospital;
       this.hospitalId = hospital._id;
      });
  }

  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital).subscribe();
    this._modalUploadService.closeSaveModal();
  }

  totalMedicos() {
    this._medicoService.cargarMedicos()
        .subscribe((resp: any) => {
          const medicos = resp.medicos;
          const arrayMd = [];
          medicos.forEach(md => {
            if (md.hospital !== null) {
              arrayMd.push({
                asignado: md.hospital
              });
            }
          });
          const medics = arrayMd.filter(x => x.asignado._id === this.hospitalId);
          this.medicosTotal = medics.length;
        });
  }

  volver() {
    this.location.back();
  }

  borrarHospital(id: string) {
    Swal.fire({
      title: 'Deseas borrar este hospital?',
      text: 'Este cambio no se puede revertir!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar este hospital!'
    })
    .then((result) => {
      if (result.value) {
        Swal.fire(
          'Hospital Borrado!',
          'Eliminado Correctamente.',
          'success'
        ),
        this._hospitalService.borrarHospital(id).subscribe();
        setTimeout(() => {
          this.router.navigate(['/hospitales']);
        }, 1000);
      };
    })
  }

  seleccionaImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire('Sólo imagenes', 'El archivo seleccioando no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  subirImagen(id: string) {
    this._modalUploadService.subirArchivo(this.imagenSubir, 'hospitales', id)
        .then(resp => resp)
        .catch(resp => {
          console.log('Error en cargar');
        });
  }


}
