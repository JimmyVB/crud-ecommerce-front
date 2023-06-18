import { Component, OnInit } from '@angular/core';
import { DirectivaService } from '../directiva.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/facturas/models/producto';
import { tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Product } from '../product';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  productos: Product[];
  paginador: any;

  constructor(private directivaService: DirectivaService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }
      
      this.directivaService.getProductos(page).pipe(
        tap(response => {
          (response.content as Producto[]).forEach(productos => {
            // console.log(cliente.nombre);
            console.log("prodicto:", productos)
          });
        })
      ).subscribe(response => {
        this.productos = response.content as Product[]
        console.log("prodicto 2 :", this.productos)
        this.paginador = response;
      });
    });
  }

  delete(producto: Producto): void {
    swal.fire({
      title: 'Estas seguro ?',
      text: `Seguro que quiere eliminar el producto ${producto.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.directivaService.delete(producto.id).subscribe(
          response => {
            this.productos = this.productos.filter(cli => cli !== producto)
            swal.fire(
              'Producto Eliminado!',
              `Producto ${producto.nombre} eliminado con exito.`,
              'success'
            )
          }
        );
      }
    })
  }
}
