import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from './product';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectivaService {

  private urlEndPoint: string = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient, private router: Router) { }

  create(producto: Product) : Observable<Product> {
    console.log("PRECIO: ", producto);
    console.log("URL: ", this.urlEndPoint);

    return this.http.post(this.urlEndPoint, producto).pipe(
      map( (response:any) => response.producto as Product),
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getProducto(id): Observable<Product> { 
    return this.http.get<Product>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
   
        if(e.status != 401 && e.error.mensaje){
          this.router.navigate(['/productos']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    );
  }

  getProductos(page: number): Observable<any> { 

    return this.http.get<Product[]>(this.urlEndPoint + '/page/' + page).pipe(
      tap( (response: any) => {
        (response.content as Product[]).forEach(producto => {
          // console.log(cliente.nombre);
        }
        )
      }),
      map( (response: any) => {
        (response.content as Product[]).map(producto => {
          producto.nombre = producto.nombre.toUpperCase();
          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy')//formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
          return producto;
        });
        return response;
      }),
      tap(response => {
        // console.log('ClienteService: Tap 2');
        (response.content as Product[]).forEach(producto => {
          // console.log(cliente.nombre);
        }
        )
      })
    );
  }

  update(producto: Product): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${producto.id}`, producto).pipe(
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Product>{
    return this.http.delete<Product>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

}
