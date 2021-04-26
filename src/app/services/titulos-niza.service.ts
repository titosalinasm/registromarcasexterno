
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../utils/data.service';
import { IResponse } from '../utils/response';
import { END_POINTS } from '../utils/endpoints';
import { environment } from 'src/environments/environment';
// import { END_POINTS, DataService, IResponse } from '../../utils';

@Injectable()
export class TitulosNizaService extends DataService<IResponse> {
    constructor(
        protected httpClient: HttpClient,
    ) {
        super(httpClient, environment.apiURL.registroURL + END_POINTS.registro.titulosNiza);
    }
}
