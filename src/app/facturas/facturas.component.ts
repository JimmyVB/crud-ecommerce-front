import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map, startWith} from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo:string = 'Nueva Factura';
  factura: Factura = new Factura();
  
  autocompleteControl = new FormControl();

  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
    private facturaService: FacturaService,
    private activatedRoute: ActivatedRoute) { }

  //Para buscar el cliente por ID, necesitamos el activadesRou§te
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      //Con el + convertimos a tipo number
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
    .pipe(
      map(value => typeof value === 'string'? value: value.nombre),
      flatMap(value => value ? this._filter(value): [])
    );
  }

  private _filter(value: string): Observable<Producto[]>{
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto):string | undefined{
    return producto? producto.nombre: undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void{
    
    let producto = event.option.value as Producto; // Producto seleccionado
    console.log(producto);

    if(this.existeItem(producto.id)){
      this.incrementaCantidad(producto.id);
    }else{
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto; // Seteamos el producto que hemos seleccionado
      this.factura.items.push(nuevoItem); // Push permite aniadir un elemento
    }

    this.autocompleteControl.setValue('');//Limpiando el autocomplete
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id:number, event:any):void{
    let cantidad:number = event.target.value as number;

    if(cantidad == 0){
      return this.eliminarItemFactura(id);
    }

    //map = para cambiar el valor de los elementos
    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    })
  }

  existeItem(id:number):boolean{
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if(id === item.producto.id){
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id:number):void{
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    })
  }

  eliminarItemFactura(id:number):void{
    this.factura.items = this.factura.items.filter((item: ItemFactura) => 
    id !== item.producto.id);
  }
}
