import { Component, OnInit } from '@angular/core';
import { Medico } from 'app/models/medico.model';
import { Location } from '@angular/common';
import { MedicoService } from 'app/services/medico/medico.service';
import { PacienteService } from 'app/services/paciente/paciente.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HospitalService } from 'app/services/hospital/hospital.service';
import { Hospital } from 'app/models/hospital.model';
import { ModalUploadService } from 'app/services/modalUpload/modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde = 0;
  totalMedicos = 0;
  arraypcts = [];
  arrMedicos = [];
  sexo: true;

  medico = {
    nombre: '',
    email: '',
    img: '',
    hospital: '',
    sexo: 'Hombre',
    telefono: '',
    _id: ''
  };

  sexos = ['Hombre', 'Mujer'];
  valor: any;
  hospitales: Hospital[] = [];
  hospital: Hospital;

  constructor(
    public _medicoService: MedicoService,
    public _pacienteService: PacienteService,
    public _hospitalesService: HospitalService,
    public _modalUploadService: ModalUploadService,
    public route: Router,
    public location: Location) { }

  ngOnInit() {
    this.cargarMedicos();
    this._hospitalesService.cargarHospitales()
        .subscribe((resp: any) => this.hospitales = resp.hospitales);
  }

  cambiarHospital(id: string) {
    this._hospitalesService.obtenerHospital(id)
        .subscribe(hospital => this.hospital = hospital);
  }

  cargarMedicos() {
    this._pacienteService.cargarPacientes()
        .subscribe((resp: any) => {
          const pacientes = resp.pacientes;
          const arraypcts = [];
          pacientes.forEach(pct => {
            if (pct.medico !== null) {
              arraypcts.push({
                id: pct.medico._id
              });
            }
          });
          this.arraypcts = arraypcts;
        });
    this._medicoService.cargarMedicos(this.desde)
      .subscribe((medicos: any) => {
        this.medicos = medicos.medicos;
        this.totalMedicos = medicos.total;

        if (this.medicos.length === 0) {
          location.reload();
        }

        const arrMedicos = [];
        const n = this.arraypcts;
        this.medicos.forEach(medico => {
          const idMedico = medico._id;
          const pacientes = n.filter(x => x.id === idMedico);
          arrMedicos.push({
            medico,
            pacientes
          })
        });

        this.arrMedicos = arrMedicos;
      });
  }

  buscarMedico(termino: string) {

    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this._medicoService.buscarMedicos(termino)
      .subscribe(medicos => this.medicos = medicos);
  }

  verMedico(id: string) {
    this._medicoService.obtenerMedico(id)
      .subscribe(resp => {
        const idx = resp._id;
        this.route.navigate(['/medico/', idx]);
      });
  }

  crearMedico(f: NgForm) {
    const nombre = this.medico.nombre;
    const email = this.medico.email;
    const img = this.medico.img;
    const hospital = this.medico.hospital;
    const telefono = this.medico.telefono;
    const valor = this.medico.sexo;


    if (valor === 'Hombre') {
      this.valor = true;
    } else {
      this.valor = false;
    }

    const sexo = this.valor;
    this._medicoService.crearMedico(nombre, email, img, hospital, telefono.trim(), sexo)
      .subscribe(() => this.cargarMedicos());

    this._modalUploadService.closeSaveModal();
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
            this._medicoService.borrarMedico(medico)
              .subscribe(() => this.cargarMedicos());
        };
      })
  }

  volver() {
    this.location.back();
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalMedicos) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();
  }

}
