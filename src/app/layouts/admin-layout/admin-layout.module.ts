import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { HospitalesComponent } from '../../hospitales/hospitales.component';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule
} from '@angular/material';
import { MedicosComponent } from 'app/medicos/medicos.component';
import { HospitalComponent } from 'app/hospitales/hospital.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MedicoComponent } from 'app/medicos/medico.component';
import { ImagenPipe } from 'app/pipes/imagen.pipe';
import { PacientesComponent } from 'app/pacientes/pacientes.component';
import { PacienteComponent } from 'app/pacientes/paciente.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BusquedaComponent } from 'app/busqueda/busqueda.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    LeafletModule,
    NgxPaginationModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    HospitalesComponent,
    HospitalComponent,
    MedicosComponent,
    MedicoComponent,
    PacientesComponent,
    PacienteComponent,
    ImagenPipe,
    BusquedaComponent
  ]
})

export class AdminLayoutModule {}
