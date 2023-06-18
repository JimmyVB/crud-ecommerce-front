import { Component, OnInit } from '@angular/core';
import { Product } from './product';
import { DirectivaService } from './directiva.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent implements OnInit {

  listaCurso: string[] = ['TypeScript', 'JavaScript', 'Java SE', 'C#', 'PHP'];
  habilitar: boolean = true; 

  producto: Product = new Product();
  errores: string[];

  constructor(private directiaService: DirectivaService, 
    private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarProducto();
  }

  setHabilitar(): void{
    this.habilitar = (this.habilitar==true) ? false:true;
  }

  cargarProducto(): void {
    this.activateRoute.params.subscribe(
      params => {
        let id = params[`id`]
        if(id){
          this.directiaService.getProducto(id).subscribe( 
            (producto) => {
              this.producto = producto 
            }
            )
        }
      });

      console.log("PRODUCTO: ", this.producto);
  }

  create(): void{
    const usuario = sessionStorage.getItem('usuario');
    const newUsuario = JSON.parse(usuario);
    this.producto.usuarioId = newUsuario.id;

    this.directiaService.create(this.producto)
    .subscribe( producto => {
        this.router.navigate(['/productos'])
        swal.fire('Nuevo Producto', `El producto ${producto.nombre} ha sido creado con exito!.`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend' + err.status);
        console.error(err.error.errors);
      }
      );
  }

  update(): void{
    this.directiaService.update(this.producto)
    .subscribe( json => {
        this.router.navigate(['/productos'])
        swal.fire('Producto Actualizado', `El producto ${json.producto.nombre} ha sido actualizado con exito!`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend' + err.status);
        console.error(err.error.errors);
      }
      );
  }
}
