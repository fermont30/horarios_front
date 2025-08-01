export class RegisterUsuario {
  constructor(
    public nombres: string,
    public apellidos: string,
    public cedula: string,
    public email: string,
    public rol: 'user' | 'staff'
  ) {}
}
