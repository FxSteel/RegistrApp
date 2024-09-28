import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  password: string = '';
  role: 'alumno' | 'profesor' = 'alumno'; // Asignar valor por defecto

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (this.authService.register(this.username, this.password, this.role)) {
      this.router.navigate(['/login']);
    } else {
      alert('Registro fallido: el usuario ya existe');
    }
  }
}
