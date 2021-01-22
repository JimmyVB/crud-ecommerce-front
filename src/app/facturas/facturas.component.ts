import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo:string = 'Nueva Factura';
  factura: Factura = new Factura();
  
  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute) { }

  //Para buscar el cliente por ID, necesitamos el activadesRoute
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      //Con el + convertimos a tipo number
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

  }

}
