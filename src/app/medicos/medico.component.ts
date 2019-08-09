import { Component, OnInit } from '@angular/core';
import { MedicoService } from 'app/services/medico/medico.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from 'app/services/modalUpload/modal-upload.service';
import { Medico } from 'app/models/medico.model';
import { Location } from '@angular/common';
import { PacienteService } from 'app/services/paciente/paciente.service';
import { tileLayer, circle, polygon, marker, icon, latLng } from 'leaflet';
import { Hospital } from 'app/models/hospital.model';
import { HospitalService } from 'app/services/hospital/hospital.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {
  hospital: Hospital;
  hospitales: Hospital[] = [];
  medicos: Medico[] = [];
  medico: Medico;
  medicoId: string;
  pacientesTotal: number;
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


  constructor(
    public _medicoService: MedicoService,
    public router: Router,
    public activatedRouter: ActivatedRoute,
    public _modalUploadService: ModalUploadService,
    public _pacientesService: PacienteService,
    public _hospitalService: HospitalService,
    public location: Location

  ) {
    activatedRouter.params.subscribe(params => {
      const id = params['id'];
      if (id !== 'medico') {
        this.verMedico(id);
      }
    })
  }

  ngOnInit() {
    this.totalPacientes();
    this._hospitalService.cargarHospitales()
        .subscribe((resp: any) => {
          this.hospitales = resp.hospitales;
        })
  }

  cambiarHospital(id: string) {
    this._hospitalService.obtenerHospital(id)
      .subscribe(hospital => this.hospital = hospital);
  }

  verMedico(id: string) {
    this._medicoService.obtenerMedico(id)
      .subscribe(medico => {
        if (medico.hospital.coords) {
          this.options = {
            layers: [
              this.tileLayer,
              marker([medico.hospital.coords.lat, medico.hospital.coords.lng],
                {
                  icon: icon({
                    iconSize: [25, 41],
                    iconAnchor: [12, 4],
                    iconUrl: 'assets/img/marker.png'
                  })
                }
              )
              .bindPopup(`${medico.hospital.nombre}`)
            ],
            zoom: 16,
            center: latLng(medico.hospital.coords.lat, medico.hospital.coords.lng),
          };
        }
        this.medico = medico;
        this.medicoId = medico._id;
      });
  }

  guardarMedico(hospital: Hospital) {
    this._medicoService.actualizarMedico(hospital).subscribe();
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: 'Deseas borrar este Médico?',
      text: medico.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar este Médico!',
      cancelButtonText: 'Cancelar'
    })
      .then((result) => {
        if (result.value) {
          Swal.fire(
            'Médico Borrado!',
            'Eliminado Correctamente.',
            'success'
          ),
            this._medicoService.borrarMedico(medico).subscribe();
          setTimeout(() => {
            this.router.navigate(['/medicos']);
          }, 2000);
        };
      })
  }

  totalPacientes() {
    this._pacientesService.cargarPacientes()
      .subscribe((resp: any) => {
        const pacientes = resp.pacientes;
        const arrayPcts = [];
        pacientes.forEach(pcts => {
          if (pcts.medico !== null) {
            arrayPcts.push({
              asignado: pcts.medico._id
            });
          }
        });
        const pcnts = arrayPcts.filter(x => x.asignado === this.medicoId);
        this.pacientesTotal = pcnts.length;
      });
  }

  volver() {
    this.location.back();
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
    this._modalUploadService.subirArchivo(this.imagenSubir, 'medicos', id)
      .then(resp => resp)
      .catch(resp => {
        console.log('Error en cargar');
      });
  }

}
