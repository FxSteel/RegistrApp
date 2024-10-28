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
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.nombre = this.authService.getUsername() || '';
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
        document.querySelector('img')!.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    this.router.navigate(['/home']);
  }

  cancelar() {
    this.router.navigate(['/home']);
  }
}
