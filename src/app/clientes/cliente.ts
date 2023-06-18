import { Factura } from '../facturas/models/factura';
import { Region } from './region';

export class Cliente {
    id: number;
    nombre: string;
    apellido: string;
    createAt: string;
    email: string;
    foto: string;
    region: Region;
    ruc: string;
    usuarioId: number;
    facturas: Array<Factura> = [];
}
