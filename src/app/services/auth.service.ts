import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: { [username: string]: { password: string; role: 'alumno' | 'profesor' } } = {};
  private loggedInUser: string | null = null;
  private userRole: 'alumno' | 'profesor' | null = null;

  register(username: string, password: string, role: 'alumno' | 'profesor'): boolean {
    if (this.users[username]) {
      return false; // Usuario ya existe
    }
    this.users[username] = { password, role }; // Guardar usuario y rol
    return true; // Registro exitoso
  }

  authenticate(username: string, password: string): boolean {
    if (this.users[username]?.password === password) {
      this.loggedInUser = username; // Establecer usuario logueado
      this.userRole = this.users[username].role; // Establecer rol del usuario
      return true; // Autenticación exitosa
    }
    return false; // Autenticación fallida
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
    this.loggedInUser = null; // Limpiar usuario logueado
    this.userRole = null; // Limpiar rol
  }

  resetPassword(usernameOrEmail: string): boolean {
    if (this.users[usernameOrEmail]) {
      console.log(`Enviando correo a ${usernameOrEmail} con instrucciones para restablecer la contraseña.`);
      return true;
    }
    return false;
  }
  
  
}
