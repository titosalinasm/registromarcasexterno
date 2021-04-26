import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClasesnizaComponent } from './components/clasesniza/clasesniza.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MasInformacionComponent } from './components/mas-informacion/mas-informacion.component';
import { PreguntasfrecuentesComponent } from './components/preguntasfrecuentes/preguntasfrecuentes.component';
import { RegistroComponent } from './components/registro/registro.component';
import { TerminosComponent } from './components/terminos/terminos.component';


const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  {
    path: 'inicio', component: InicioComponent
  },
  { path: 'registro', component: RegistroComponent },
  { path: 'mas-informacion', component: MasInformacionComponent },
  { path: 'terminos-y-condiciones', component: TerminosComponent },
  { path: 'preguntas-frecuentes', component: PreguntasfrecuentesComponent },
  { path: 'clases-niza', component: ClasesnizaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
