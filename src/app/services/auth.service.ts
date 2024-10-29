import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: { 
    [username: string]: { 
      password: string; 
      role: 'alumno' | 'profesor'; 
      apellido?: string; 
      correo?: string; 
      profilePictureUrl?: string; // Nueva propiedad para almacenar la URL de la imagen
    } 
  } = {
    'admin': { password: 'admin', role: 'profesor' },
    'root': { password: 'root', role: 'alumno' }
  };
  private loggedInUser: string | null = null;
  private userRole: 'alumno' | 'profesor' | null = null;

  constructor() {
    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.userRole = localStorage.getItem('userRole') as 'alumno' | 'profesor' | null;
  }

  register(username: string, password: string, role: 'alumno' | 'profesor', apellido?: string, correo?: string, profilePictureUrl?: string): boolean {
    if (this.users[username]) {
      return false; // Usuario ya existe
    }
    this.users[username] = { password, role, apellido, correo, profilePictureUrl }; // Almacenar apellido, correo y URL de imagen
    localStorage.setItem('users', JSON.stringify(this.users)); // Guarda en localStorage
    return true; // Registro exitoso
  }

  getUserData(username: string) {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
    return this.users[username];
  }

  updateUserData(username: string, apellido: string, correo: string) {
    if (this.users[username]) {
      this.users[username].apellido = apellido;
      this.users[username].correo = correo;
      localStorage.setItem('users', JSON.stringify(this.users)); // Guarda en localStorage
    }
  }

  updateProfilePicture(username: string, profilePictureUrl: string) {
    if (this.users[username]) {
      this.users[username].profilePictureUrl = profilePictureUrl;
      localStorage.setItem('users', JSON.stringify(this.users)); // Guarda en localStorage
    }
  }

  authenticate(username: string, password: string): boolean {
    if (this.users[username]?.password === password) {
      this.loggedInUser = username;
      this.userRole = this.users[username].role;

      // Guardar en localStorage
      localStorage.setItem('loggedInUser', username);
      localStorage.setItem('userRole', this.userRole);
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return this.loggedInUser !== null;
  }

  getUsername(): string | null {
    return this.loggedInUser;
  }

  getRole(): 'alumno' | 'profesor' | null {
    return this.userRole;
  }

  clear(): void {
    this.loggedInUser = null;
    this.userRole = null;
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('users'); // Limpiar usuarios también
  }

  resetPassword(usernameOrEmail: string): boolean {
    if (this.users[usernameOrEmail]) {
      console.log(`Enviando correo a ${usernameOrEmail} con instrucciones para restablecer la contraseña.`);
      return true;
    }
    return false;
  }
}
