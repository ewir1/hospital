import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Servicios
import { AdminService } from './admin/admin.service';
import { UsuarioService } from './usuario/usuario.service';
import { MedicoService } from './medico/medico.service';
import { HospitalService } from './hospital/hospital.service';
import { ModalUploadService } from './modalUpload/modal-upload.service';
import { PacienteService } from './paciente/paciente.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AdminService,
    UsuarioService,
    MedicoService,
    HospitalService,
    ModalUploadService,
    PacienteService
  ]
})
export class ServicesModule { }
