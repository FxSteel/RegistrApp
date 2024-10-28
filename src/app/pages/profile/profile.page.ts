import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  profilePictureUrl: string | null = null; // Propiedad para la URL de la imagen
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.nombre = this.authService.getUsername() || '';
      const userData = this.authService.getUserData(this.nombre); // Obtiene los datos del usuario
      this.apellido = userData?.apellido || ''; // Cargar apellido del usuario
      this.correo = userData?.correo || ''; // Cargar correo del usuario
      this.profilePictureUrl = localStorage.getItem('profilePictureUrl'); // Cargar URL de la imagen
    }
  }

  onEditPicture() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePictureUrl = e.target.result; // Guardar la URL de la imagen en la variable
        localStorage.setItem('profilePictureUrl', this.profilePictureUrl || ''); // Guardar en localStorage
      };
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    // Llamar a updateUserData para guardar apellido y correo
    this.authService.updateUserData(this.authService.getUsername() || '', this.apellido, this.correo);
    this.router.navigate(['/home']);
  }
  
  cancelar() {
    this.router.navigate(['/home']);
  }
}
