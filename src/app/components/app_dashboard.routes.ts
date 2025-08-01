import { Routes } from '@angular/router';
import { Home } from './dash/home/home';
import { Docentes } from './docentes/docentes';
import { Asignaturas } from './asignaturas/asignaturas';
import { Asistencias } from './asistencias/asistencias';
import { Aulas } from './aulas/aulas';
import { Carreras } from './carreras/carreras';
import { Disponibilidad } from './disponibilidad/disponibilidad';
import { Horarios } from './horarios/horarios';
import { Periodos } from './periodos/periodos';
import { Permisos } from './permisos/permisos';
import { Usuarios } from './usuarios/usuarios';
import { Register } from './auth/register/register';
import { Newcarrera } from './carreras/newcarrera/newcarrera';

export const routesDashboard: Routes = [
  {
    path: 'dash',
    component: Home,
    children: [
      { path: 'asignaturas', component: Asignaturas },
      { path: 'asistencia', component: Asistencias },
      { path: 'aulas', component: Aulas },
      { path: 'carreras', component: Carreras },
      { path: 'nueva-carrera', component: Newcarrera },
      { path: 'nueva-carrera/:id', component: Newcarrera },
      { path: 'disponibilidad', component: Disponibilidad },
      { path: 'docentes', component: Docentes },
      { path: 'horarios', component: Horarios },
      { path: 'periodo', component: Periodos },
      { path: 'permisos', component: Permisos },
      { path: 'register', component: Register },      
      { path: 'usuarios', component: Usuarios },
      { path: '', redirectTo: 'horarios', pathMatch: 'full' }

    ]
  }
];
