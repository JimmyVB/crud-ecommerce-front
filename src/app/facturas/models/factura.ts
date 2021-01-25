import { Cliente } from 'src/app/clientes/cliente';
import { ItemFactura } from './item-factura';

export class Factura {
    id: number;
    descripcion: string;
    observacion: string;
    items: Array<ItemFactura> = [];
    cliente : Cliente;
    totalFactura: number;
    createAt: string;

    calcularGranTotal(): number{
        this.totalFactura = 0;
        this.items.forEach((item:ItemFactura) => {
            this.totalFactura += item.calcularImporte();
        });
        return this.totalFactura;
    }
}
