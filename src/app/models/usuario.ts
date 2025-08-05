// models/usuario.ts
export interface Rol {
  id: number;
  rolNombre: string;
}
export interface Usuario {
  id?: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  email: string;
  password?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  roles: Rol[]; // Para recibir del backend
}
export interface UsuarioUpdate {
  nombres: string;
  apellidos: string;
  cedula: string;
  email: string;
  roles: string[]; // Para enviar al backend
}