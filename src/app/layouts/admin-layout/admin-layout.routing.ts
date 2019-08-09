import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { HospitalesComponent } from 'app/hospitales/hospitales.component';
import { MedicosComponent } from 'app/medicos/medicos.component';
import { HospitalComponent } from 'app/hospitales/hospital.component';
import { MedicoComponent } from 'app/medicos/medico.component';
import { PacientesComponent } from 'app/pacientes/pacientes.component';
import { PacienteComponent } from 'app/pacientes/paciente.component';
import { BusquedaComponent } from 'app/busqueda/busqueda.component';
import { LoginGuard } from 'app/services/login/login.guard';
import { TokenGuard } from 'app/services/guard/token.guard';
import { AdminGuard } from 'app/services/guard/admin.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' }, canActivate: [TokenGuard] },
    { path: 'user-profile', component: UserProfileComponent, data: { titulo: 'Perfil de usuario' }, canActivate: [AdminGuard] },
    { path: 'maps', component: MapsComponent, data: { titulo: 'Mapas de hospitales' }, canActivate: [AdminGuard] },
    { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Hospitales' }, canActivate: [AdminGuard] },
    { path: 'hospital/:id', component: HospitalComponent, data: { titulo: 'Hospital' }, canActivate: [AdminGuard] },
    { path: 'medicos', component: MedicosComponent, data: { titulo: 'Medicos' }, canActivate: [AdminGuard] },
    { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Medico' }, canActivate: [AdminGuard] },
    { path: 'pacientes', component: PacientesComponent, data: { titulo: 'Pacientes' }, canActivate: [AdminGuard] },
    { path: 'paciente/:id', component: PacienteComponent, data: { titulo: 'Paciente' }, canActivate: [AdminGuard] },
    { path: 'busqueda/:termino', component: BusquedaComponent, data: { titulo: 'Buscador' }, canActivate: [AdminGuard] }
    
    // { path: 'table-list',     component: TableListComponent, data: { titulo: 'Listado' } },
    // { path: 'typography',     component: TypographyComponent, data: { titulo: 'Typogrfía' } },
    // { path: 'icons',          component: IconsComponent, data: { titulo: 'Iconos' } },
    // { path: 'notifications',  component: NotificationsComponent, data: { titulo: 'Notificaciones' } },
    // { path: 'upgrade',        component: UpgradeComponent, data: { titulo: 'Upgrade' } },
];
