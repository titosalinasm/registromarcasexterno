import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from 'src/app/global.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { CONSTANTES} from 'src/app/utils/constantes-globales';

@Component({
  selector: 'app-preguntasfrecuentes',
  templateUrl: './preguntasfrecuentes.component.html',
  styleUrls: ['./preguntasfrecuentes.component.css']
})
export class PreguntasfrecuentesComponent implements OnInit {

  lstPreguntasFrecuentes : any[];
  vcManual : string;
  objConfiguracion : any;

  constructor( private _spinner : NgxSpinnerService,
    private _configuracionService: ConfiguracionService,
    private globalService: GlobalService,

    ) {

      this.doPreguntasFrecuentes();
      this.objConfiguracion=this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_P_001))[0];
    }

  ngOnInit(): void {

  }

  doPreguntasFrecuentes(){
    this._spinner.show();
    let param={
      vcCodConfiguracion: ''
    }
    this._configuracionService.getWithPost$(param).subscribe(
      resp=>{
        this._spinner.hide();
        console.log(JSON.stringify);
        this.globalService.lstConfiguracion = resp.lstConfiguracion;
        this.lstPreguntasFrecuentes=this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes('COD_PRE_FRE'))[0].clValor1.lstPreguntasFrecuentes;
         this.vcManual = this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes('COD_MANUAL'))[0].vcValor1;
      },
      error=>{
        this._spinner.hide();
      }
    );
  }
}
