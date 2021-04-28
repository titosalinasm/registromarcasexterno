import { Component, OnInit } from '@angular/core';
import { ConsultaTerminosService } from 'src/app/services/consulta-terminos.service';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.component.html',
  styleUrls: ['./terminos.component.css']
})
export class TerminosComponent implements OnInit {

  objTerminos : any;
  vcManual : string;
  objConfiguracion : any;

  constructor(
              private _consultaTerminosService : ConsultaTerminosService,
              private _spinner : NgxSpinnerService,
              private _configuracionService: ConfiguracionService,
              private globalService: GlobalService,
              ) {
    this.doConsultaTerminos();
    this.doConfiguracion();
    this.objConfiguracion=this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_P_001))[0];
    // this.vcManual = this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes('COD_MANUAL'))[0].vcValor1;
   }

  ngOnInit(): void {

  }

  doConsultaTerminos(){
    this._spinner.show();
    let param={
      nuIdProcedimiento: CONSTANTES.appId.registro_marcas
    }
    this._consultaTerminosService.getWithPost$(param).subscribe(
      resp=>{
        this._spinner.hide();
        console.log(JSON.stringify);
        this.objTerminos=resp;
      },
      error=>{
        this._spinner.hide();
      }
    );
  }

  doConfiguracion(){
    this._spinner.show();
    let param={
      vcCodConfiguracion: ''
    }
    this._configuracionService.getWithPost$(param).subscribe(
      resp=>{
        this._spinner.hide();
        console.log(JSON.stringify);
        this.globalService.lstConfiguracion = resp.lstConfiguracion;
        // this.lstPreguntasFrecuentes=this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes('COD_PRE_FRE'))[0].clValor1.lstPreguntasFrecuentes;
         this.vcManual = this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes('COD_MANUAL'))[0].vcValor1;
      },
      error=>{
        this._spinner.hide();
      }
    );
  }

}
