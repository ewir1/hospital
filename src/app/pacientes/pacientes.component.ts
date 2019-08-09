import { Component, OnInit } from '@angular/core';
import { PacienteService } from 'app/services/paciente/paciente.service';
import { MedicoService } from 'app/services/medico/medico.service';
import { HospitalService } from 'app/services/hospital/hospital.service';
import { Paciente } from 'app/models/paciente.model';
import { Hospital } from 'app/models/hospital.model';
import { Medico } from 'app/models/medico.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalUploadService } from 'app/services/modalUpload/modal-upload.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  hospitales: Hospital[] = [];
  pacientesSelect: Paciente[] = [];
  hospitalesSelect: Hospital[] = [];
  medicos: Medico[] = [];
  filtroMedicos: Medico[] = [];

  ocultarTabla = true;
  sinResultados = false;
  totalPacientes = 0;

  sexo: true;
  paciente = {
    nombre: '',
    email: '',
    telefono: '',
    edad: null,
    fnacimiento: '',
    tsangre: '',
    hospital: '',
    medico: '',
    sexo: 'Masculino',
    _id: ''
  };

  sexos = ['Masculino', 'Femenino'];
  valor: any;

  idHospital: string;
  idMedico: string;

  p = 1;

  constructor(
    public _pacienteService: PacienteService,
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService,
    public route: Router,
    public location: Location
  ) { }

  ngOnInit() {
    this._hospitalService.cargarHospitales()
      .subscribe((hospitales: any) => this.hospitales = hospitales.hospitales);
  }

  seleccionaHospital(id: string) {
    this._medicoService.cargarMedicos()
      .subscribe((medicos: any) => {
        const filtMedicos = medicos.medicos.filter(x => x.hospital._id === id);
        this.medicos = filtMedicos;
      });
  }

  seleccionaMedico(id: string) {
    this._pacienteService.cargarPacientes()
      .subscribe((pacientes: any) => {
        const filtPacientes = pacientes.pacientes.filter(x => x.medico._id === id);
        this.pacientes = filtPacientes;
        if (this.pacientes) {
          this.totalPacientes = filtPacientes.length;
        }

        if (this.pacientes.length > 0) {
          this.ocultarTabla = false;
          this.sinResultados = false;
        }

        if (this.pacientes.length === 0 && id.length > 0) {
          this.ocultarTabla = false;
        }

        if (this.pacientes.length === 0) {
          this.sinResultados = true;
        }

      });
  }

  selectHospital(id: string) {
    this._hospitalService.obtenerHospital(id)
        .subscribe(((hospital: any) => {
          this.idHospital = hospital._id;
        }));
        this.listarMedicos();
  }

  listarMedicos() {
    this._medicoService.cargarMedicos()
        .subscribe((medicos: any) => {
          const filtraHospital = medicos.medicos.filter(x => x.hospital._id === this.idHospital);
          this.filtroMedicos = filtraHospital;
        });
  }

  selectMedico(id: string) {
    this._medicoService.obtenerMedico(id)
      .subscribe(((medico: any) => {
        this.idMedico = medico._id;
      }));
    this.listarMedicos();
  }

  verPaciente(id: string) {
    this._pacienteService.obtenerPaciente(id)
      .subscribe(resp => {
        const idx = resp._id;
        this.route.navigate(['/paciente/', idx]);
      });
  }

  crearPaciente(f: NgForm) {
    const nombre = this.paciente.nombre;
    const email = this.paciente.email;
    const telefono = this.paciente.telefono;
    const edad = this.paciente.edad;
    const fnacimiento = this.paciente.fnacimiento;
    const tsangre = this.paciente.tsangre;
    const hospital = this.paciente.hospital;
    const medico = this.paciente.medico;
    const valor = this.paciente.sexo;


    if (valor === 'Hombre') {
      this.valor = true;
    } else {
      this.valor = false;
    }

    const sexo = this.valor;
    this._pacienteService.crearPaciente(nombre, email, telefono.trim(), edad, fnacimiento, tsangre, hospital, medico, sexo).subscribe();

    this._modalUploadService.closeSaveModal();
    Swal.fire('Paciente creado', 'Paciente creado con exito', 'success');
    setTimeout(() => {
      location.reload();
    }, 2000);
  }

  borrarPaciente(paciente: Paciente, i) {
    Swal.fire({
      title: 'Deseas borrar este paciente?',
      text: this.paciente.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar este paciente!',
      cancelButtonText: 'Cancelar'
    })
      .then((result) => {
        if (result.value) {
          Swal.fire(
            'Paciente Borrado!',
            'Eliminado Correctamente.',
            'success'
          ),
          this._pacienteService.borrarPaciente(paciente)
            .subscribe(() => {
              this.pacientes.splice(i, 1);
            });
        };
      })
  }

  volver() {
    this.location.back();
  }

}
