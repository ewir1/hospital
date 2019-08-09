import { Component, OnInit } from '@angular/core';
// import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { Location } from '@angular/common';
import { HospitalService } from 'app/services/hospital/hospital.service';
import { Hospital } from 'app/models/hospital.model';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MedicoService } from 'app/services/medico/medico.service';
import { NgForm } from '@angular/forms';
import { ModalUploadService } from 'app/services/modalUpload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit {
  hospitales: Hospital[] = [];
  desde = 0;
  totalHospitales = 0;
  arrHospitales = [];
  arrayMd = [];

  hospital = {
    nombre: '',
    img: '',
    estado: '',
    ciudad: '',
    telefono: '',
    _id: '',
    lat: '',
    lng: ''
  }

  constructor(
    public _hospitalService: HospitalService,
    public _medicoService: MedicoService,
    public _modalUploadService: ModalUploadService,
    public route: Router,
    public location: Location
  ) { }

  ngOnInit() {
    this.cargarHospitales();
  }

  buscarHospital(termino: string) {

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this._hospitalService.buscarHospital(termino)
      .subscribe(hospitales => this.hospitales = hospitales);
  }

  cargarHospitales() {
    this._medicoService.cargarMedicos()
      .subscribe((resp: any) => {
        const medicos = resp.medicos;
        const arrayMd = [];
        medicos.forEach(md => {
          if (md.hospital !== null) {
            arrayMd.push({
              id: md.hospital._id
            });
          }
        });

        this.arrayMd = arrayMd;
      });
      this._hospitalService.cargarHospitales(this.desde)
      .subscribe((hospitales: any) => {
        this.hospitales = hospitales.hospitales;
        this.totalHospitales = hospitales.total;

        if (this.hospitales.length === 0) {
          location.reload();
        }

        const arrHospitales = [];
        const n = this.arrayMd;
        hospitales.hospitales.forEach(hospital => {
          const idHospital = hospital._id;
          const medicos = n.filter(x => x.id === idHospital);
          arrHospitales.push({
            hospital,
            medicos
          })
        });
        this.arrHospitales = arrHospitales;
      });
  }

  verHospital(id: string) {
    this._hospitalService.obtenerHospital(id)
      .subscribe(resp => {
        const idx = resp._id;
        this.route.navigate(['/hospital/', idx]);
      });
  }

  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital).subscribe();
  }

  borrarHospital(hospital: Hospital) {
    Swal.fire({
      title: 'Deseas borrar este hospital?',
      text: hospital.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar este hospital!',
      cancelButtonText: 'Cancelar'
    })
    .then((result) => {
      if (result.value) {
        Swal.fire(
          'Hospital Borrado!',
          'Eliminado Correctamente.',
          'success'
        ),
          this._hospitalService.borrarHospital(hospital._id)
              .subscribe(() => this.cargarHospitales());
      };
    })
  }


  crearHospital() {
    const nombre = this.hospital.nombre;
    const img = this.hospital.img;
    const estado = this.hospital.estado;
    const ciudad = this.hospital.ciudad;
    const lat = this.hospital.lat;
    const lng = this.hospital.lng;

    this._hospitalService.crearHospital(nombre, img, estado, ciudad, lat, lng)
      .subscribe(() => this.cargarHospitales());

    this._modalUploadService.closeSaveModal();
  }

  // actualizarImagen(hospital: Hospital) {
  //   this._modalUploadService.mostrarModal('hospitales', hospital._id);
  // }

  volver() {
    this.location.back();
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalHospitales) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  }
}
