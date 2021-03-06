import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';

// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);
// ngx-bootstrap

import { InicioComponent } from './components/inicio/inicio.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
// import { EnvServiceProvider } from './env.service.provider';
import { BannerPrincipalComponent } from './components/banner-principal/banner-principal.component';
import { DataGlobalService } from './services/data-global.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InicioService } from './services/inicio-terminos.service';
import { DataSelService } from './services/data-sel.service';
import { MenuComponent } from './components/menu/menu.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InicioAceptoTerminoService } from './services/inicio-acepto-terminos.service';
import { MasInformacionComponent } from './components/mas-informacion/mas-informacion.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AsesoriaVirtualComponent } from './components/asesoria-virtual/asesoria-virtual.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { DatosSignoComponent } from './components/datos-signo/datos-signo.component';
import { ClasificacionSignoComponent } from './components/clasificacion-signo/clasificacion-signo.component';
import { PrioridadExtranjeraComponent } from './components/prioridad-extranjera/prioridad-extranjera.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AvisosService } from './services/avisos.service';
import { ConfiguracionService } from './services/configuracion.service';

import { NgxSpinnerModule } from "ngx-spinner";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SubirArchivoService } from './services/subir-archivo.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TitulosNizaService } from './services/titulos-niza.service';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { ConfirmarPagarComponent } from './components/confirmar-pagar/confirmar-pagar.component';
import { PideService } from './services/pide.service';
import { UbigeoService } from './services/ubigeo.service';
import { PagoService } from './services/data-pago.service';
import { RegistrarSolicitudService } from './services/registrar-solicitud.service';

import {
  ToastrModule,
  ToastNoAnimation,
  ToastNoAnimationModule
} from 'ngx-toastr';
import { TerminosComponent } from './components/terminos/terminos.component';
import { PreguntasfrecuentesComponent } from './components/preguntasfrecuentes/preguntasfrecuentes.component';
import { ClasesnizaComponent } from './components/clasesniza/clasesniza.component';
import { ConsultaTerminosService } from './services/consulta-terminos.service';
import { ValidaExpedienteService } from './services/valida-expediente.service';
import { ValidaCertificadoService } from './services/valida-certificado.service';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    TooltipComponent,
    BannerPrincipalComponent,
    StepperComponent,
    MenuComponent,
    FooterComponent,
    InicioComponent,
    MasInformacionComponent,
    RegistroComponent,
    AsesoriaVirtualComponent,
    DatosSignoComponent,
    ClasificacionSignoComponent,
    PrioridadExtranjeraComponent,
    DatosPersonalesComponent,
    ConfirmarPagarComponent,
    TerminosComponent,
    PreguntasfrecuentesComponent,
    ClasesnizaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ButtonsModule.forRoot(),
    FontAwesomeModule,
    ToastNoAnimationModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  providers: [
    // EnvServiceProvider,
    DataGlobalService,
    DataSelService,
    PideService,
    UbigeoService,
    ConfiguracionService,
    InicioService,
    AvisosService,
    InicioAceptoTerminoService,
    SubirArchivoService,
    TitulosNizaService,
    RegistrarSolicitudService,
    PagoService,
    ConsultaTerminosService,
    ValidaExpedienteService,
    ValidaCertificadoService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
