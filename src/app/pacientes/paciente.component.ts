import { Component, OnInit } from '@angular/core';
import { PacienteService } from 'app/services/paciente/paciente.service';
import { MedicoService } from 'app/services/medico/medico.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from 'app/services/modalUpload/modal-upload.service';
import { HospitalService } from 'app/services/hospital/hospital.service';
import { Location } from '@angular/common';
import { Paciente } from 'app/models/paciente.model';
import { Hospital } from 'app/models/hospital.model';
import { Medico } from 'app/models/medico.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  hospitales: Hospital[] = [];
  medicos: Medico[] = [];
  filtroMedicos: Medico[] = [];
  idHospital: string;
  idMedico: string;

  // paciente: string;

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
      if (id !== 'paciente') {
        this.verPaciente(id);
      }
    })
  }

  ngOnInit() {
  }

  verPaciente(id: string) {
    this._pacientesService.obtenerPaciente(id)
      .subscribe(paciente => {
        this.paciente = paciente;
      });

    this._hospitalService.cargarHospitales()
        .subscribe((hospitales: any) => {
          this.hospitales = hospitales.hospitales;
        });

    // this._medicoService.cargarMedicos()
    //   .subscribe((medicos: any) => {
    //     const medicosFilt = medicos.medicos.filter(x => x.hospital._id === id);
    //   });
  }

  seleccioneHospital(id: string) {
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

  seleccioneMedico(id: string) {
    this._medicoService.obtenerMedico(id)
      .subscribe(((medico: any) => {
        this.idMedico = medico._id;
      }));
  }

  guardarPaciente(paciente: Paciente) {
    this._pacientesService.actualizarPaciente(paciente).subscribe();
  }

  borrarPaciente(paciente: Paciente) {
    Swal.fire({
      title: 'Deseas borrar este Paciente?',
      text: paciente.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar este Paciente!',
      cancelButtonText: 'Cancelar'
    })
      .then((result) => {
        if (result.value) {
          Swal.fire(
            'Paciente Borrado!',
            'Eliminado Correctamente.',
            'success'
          ),
          this._pacientesService.borrarPaciente(paciente).subscribe();
          setTimeout(() => {
            this.router.navigate(['/pacientes']);
          }, 2000);
        };
      })
  }

  volver() {
    this.location.back();
  }

}
