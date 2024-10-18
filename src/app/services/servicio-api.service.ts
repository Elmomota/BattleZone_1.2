import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from'@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


@Injectable({
 providedIn: 'root'
})

export class ServicioApiService {

  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' :'*'
    })
    }
    // Se establece la base url del API a consumir
    apiURL = 'https://newsapi.org/v2/everything?q=gaming&language=es&apiKey=5a2611709c934dc09ee2c8b612410abe';
    // Se declara la variable http de tipo HttpClient
    constructor(private http:HttpClient) { }
   

    getNoticias(): Observable<any> {
      return this.http.get<any>(this.apiURL).pipe(
        retry(3),
        catchError(this.handleError)
        );
    }


    getNoticia(id:string):Observable<any>{
      return this.http.get(`${this.apiURL}/${id}`).pipe(
        retry(3),
        catchError(this.handleError)
      )

      }
     
      private handleError(error: any) {
        console.error('Error en la petición HTTP', error);
        return throwError('Error en la petición; intenta de nuevo más tarde.');
      }

    
}
