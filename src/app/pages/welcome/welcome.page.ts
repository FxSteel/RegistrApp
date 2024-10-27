import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  showProgressBar: boolean = false;

  constructor(private router: Router) {}

  goToLogin() {
    this.showProgressBar = true;  // Muestra la barra de progreso
    setTimeout(() => {
      this.router.navigate(['/login']);
      this.showProgressBar = false;  // Oculta la barra de progreso al cargar la página de inicio de sesión
    }, 1000); // Ajusta el tiempo si deseas una espera más larga o corta
  }
}
