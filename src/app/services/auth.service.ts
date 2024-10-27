import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: { [username: string]: { password: string; role: 'alumno' | 'profesor' } } = {
    'admin': { password: 'admin', role: 'profesor' },
    'root': { password: 'root', role: 'alumno' }
  };
  private loggedInUser: string | null = null;
  private userRole: 'alumno' | 'profesor' | null = null;

  constructor() {
    // Cargar datos de localStorage al inicializar el servicio
    this.loggedInUser = localStorage.getItem('loggedInUser');
    this.userRole = localStorage.getItem('userRole') as 'alumno' | 'profesor' | null;
  }

  register(username: string, password: string, role: 'alumno' | 'profesor'): boolean {
    if (this.users[username]) {
      return false; // Usuario ya existe
    }
    this.users[username] = { password, role };
    return true;
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
  }

  resetPassword(usernameOrEmail: string): boolean {
    if (this.users[usernameOrEmail]) {
      console.log(`Enviando correo a ${usernameOrEmail} con instrucciones para restablecer la contraseña.`);
      return true;
    }
    return false;
  }
}
