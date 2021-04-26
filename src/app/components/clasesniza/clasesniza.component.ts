import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from 'src/app/global.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { TitulosNizaService } from 'src/app/services/titulos-niza.service'

@Component({
  selector: 'app-clasesniza',
  templateUrl: './clasesniza.component.html',
  styleUrls: ['./clasesniza.component.css']
})
export class ClasesnizaComponent implements OnInit {

  objClaseNiza : any;
  vcManual : string;

  constructor(
    private _titulosNizaService : TitulosNizaService,
    private _spinner : NgxSpinnerService,
    private _configuracionService: ConfiguracionService,
    private globalService: GlobalService,
  ) {
    this.doLstClaseNiza();
    this.doConfiguracion();
   }

  ngOnInit(): void {

  }

  doLstClaseNiza(){
    this._spinner.show();
    let param={
      vcParaBusq:''
    }
    this._titulosNizaService.getWithPost$(param).subscribe(
      resp=>{
        this._spinner.hide();
        this.objClaseNiza=resp;
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
