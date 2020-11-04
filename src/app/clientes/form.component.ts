import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();
  regiones: Region[];
  titulo:string = "Crear Cliente";

  errores: string[];
  constructor(private clienteService: ClienteService,
    private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  cargarCliente(): void {
    this.activateRoute.params.subscribe(
      params => {
        let id = params[`id`]
        if(id){
          this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente )
        }
      });
  }

  create(): void{
    this.clienteService.create(this.cliente)
    .subscribe( cliente => {
        this.router.navigate(['/clientes'])
        swal.fire('Nuevo Cliente', `El cliente ${cliente.nombre} ha sido creado con exito!.`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend' + err.status);
        console.error(err.error.errors);
      }
      );
  }

  update(): void{
    this.clienteService.update(this.cliente)
    .subscribe( json => {
        this.router.navigate(['/clientes'])
        swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend' + err.status);
        console.error(err.error.errors);
      }
      );
  }

  compararRegion(o1: Region, o2:Region){
    return o1 == null || o2 == null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }
}
