import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/services/usuario/usuario.service';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'Perfil',  icon: 'person', class: '' },
    { path: '/hospitales', title: 'Hospitales',  icon: 'business', class: '' },
    { path: '/medicos', title: 'Médicos', icon: 'enhanced_encryption', class: '' },
    { path: '/pacientes', title: 'Pacientes', icon: 'favorite', class: '' },
    { path: '/maps', title: 'Mapa Hospitales',  icon: 'location_on', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  titulo: string;

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router,
    public title: Title,
    public meta: Meta) {
    this.getDataRoute().subscribe(data => {
      this.titulo = data.titulo;
      this.title.setTitle(this.titulo);

      const metaTag: MetaDefinition = {
        name: 'description',
        content: this.titulo
      };
      this.meta.updateTag(metaTag);
      });
    }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  getDataRoute() {
    return this.router.events.pipe(
      filter(evento => evento instanceof ActivationEnd),
      filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
      map((evento: ActivationEnd) => evento.snapshot.data)
    );
  }

}
