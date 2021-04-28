import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { Router } from '@angular/router';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { AsesoriaVirtualComponent } from '../asesoria-virtual/asesoria-virtual.component';
import { DatosSignoComponent } from '../datos-signo/datos-signo.component';
import { ClasificacionSignoComponent } from '../clasificacion-signo/clasificacion-signo.component';
import { PrioridadExtranjeraComponent } from '../prioridad-extranjera/prioridad-extranjera.component';
import { DatosPersonalesComponent } from '../datos-personales/datos-personales.component';
import { ConfirmarPagarComponent } from '../confirmar-pagar/confirmar-pagar.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  @ViewChild('appAsesoriaVirtual') appAsesoriaVirtual: AsesoriaVirtualComponent;
  @ViewChild('appDatosSigno') appDatosSigno: DatosSignoComponent;
  @ViewChild('appClasificacionSigno') appClasificacionSigno: ClasificacionSignoComponent;
  @ViewChild('appPrioridadExtranjera') appPrioridadExtranjera: PrioridadExtranjeraComponent;
  @ViewChild('appDatosPersonales') appDatosPersonales: DatosPersonalesComponent;
  @ViewChild('appConfirmarPagar') appConfirmarPagar: ConfirmarPagarComponent;

  // vcTitulo: string;
  vcImg: string;
  vcTituloObra: string;
  objInfo: any = {};

  public nuDestino: number = 1;
  public spinner: boolean = false;

  public invalidAsesoriaVirtual: boolean = false;
  public invalidDatosSigno: boolean = false;
  public invalidClasificacionSigno: boolean = true;
  public invalidPrioridadExtranjera: boolean = false;
  public invalidDatosPersonales: boolean = false;
  public invalidConfirmarPagar: boolean = true;

  public isInvalid: boolean = false;
  objConfiguracion: any = {};
  vcManual : any;

  constructor(
    private globalService: GlobalService,
    private router: Router
  ) {
    this.objConfiguracion=this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_P_001))[0];
    this.vcManual = this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes('COD_MANUAL'))[0].vcValor1;
  }

  ngOnInit() {
    // console.log("configuracion: datos oninit: "+JSON.stringify(this.globalService.lstConfiguracion));
  }

  validEvent($event: any) {
    this.isInvalid = $event;

  }

  // spinnerEventHander($event: any) {
  //   this.spinner = $event;
  // }

  validEventAsesoriaVirtual($event: any) {
    this.invalidAsesoriaVirtual = $event;
  }

  validEventDatosSigno($event: any) {
    this.invalidDatosSigno = $event;
  }

  validEventClasificacionSigno($event: any) {
    this.invalidClasificacionSigno = $event;
  }

  validEventPrioridadExtranjera($event: any) {
    this.invalidPrioridadExtranjera = $event;
  }

  validEventDatosPersonales($event: any) {
    this.invalidDatosPersonales = $event;
  }

  validEventConfirmarPagar($event: any) {
    this.invalidConfirmarPagar = $event;
  }

  // navigateEventHander($event: any) {
  //   this.router.navigate([$event]);
  // }

  atras(nuDestino: number) {
    switch (nuDestino) {
      case 1:
        console.log('nuDestino: ' + nuDestino);
        this.appAsesoriaVirtual.atras();
        break;
      case 2:
        console.log('nuDestino: ' + nuDestino);
        this.appDatosSigno.atras();
        break;
      case 3:
        console.log('nuDestino: ' + nuDestino);
        this.appClasificacionSigno.atras();
        break;
      case 4:
        console.log('nuDestino: ' + nuDestino);
        this.appPrioridadExtranjera.atras();
        break;
      case 5:
        console.log('nuDestino: ' + nuDestino);
        this.appDatosPersonales.atras();
        break;
      case 6:
        console.log('nuDestino: ' + nuDestino);
        this.appConfirmarPagar.atras();
        break;
    }
  }

  siguiente(nuDestino: number) {
    switch (nuDestino) {
      case 1:
        console.log('nuDestino: ' + nuDestino);
        this.appAsesoriaVirtual.siguiente();
        this.appDatosSigno.cargarDatos();
        // this.isInvalid = false;
        break;
      case 2:
        console.log('nuDestino: ' + nuDestino);
        this.appDatosSigno.siguiente();
        this.appClasificacionSigno.cargarDatos();
        // console.log("Tipo solicitud: "+this.globalService.nuIdTipoSolicitud);
        if(this.globalService.nuIdTipoSolicitud==2)
        this.appDatosPersonales.cargarDatos();
        // this.isInvalid = true;
        break;
      case 3:
        console.log('nuDestino: ' + nuDestino);
        // this.isInvalid = false;
        this.appClasificacionSigno.siguiente();
        this.appPrioridadExtranjera.cargarDatos();

        if(this.globalService.nuIdTipoSolicitud==3)
        this.appDatosPersonales.cargarDatos();

        break;
      case 4:
        console.log('nuDestino: ' + nuDestino);
        // this.isInvalid = true;
        this.appPrioridadExtranjera.siguiente();
        this.appDatosPersonales.cargarDatos();
        break;
      case 5:
        console.log('nuDestino: ' + nuDestino);
        this.appDatosPersonales.siguiente();
        this.appConfirmarPagar.cargarDatos();
        break;
      case 6:
        console.log('nuDestino: ' + nuDestino);
        this.appConfirmarPagar.registrarSolicitud();
        break;
    }
  }

}
