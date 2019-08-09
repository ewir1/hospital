import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'app/services/usuario/usuario.service';
import { Usuario } from 'app/models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame = false;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 0) {
      this.recuerdame = true;
    }
  }

  ingresar(f: NgForm) {
    if (f.invalid) {
      return
    }

    const usuario = new Usuario(null, f.value.email, f.value.password);
    this._usuarioService.login(usuario, f.value.recuerdame)
        .subscribe(correcto => this.router.navigate(['/dashboard']));

  }


}
