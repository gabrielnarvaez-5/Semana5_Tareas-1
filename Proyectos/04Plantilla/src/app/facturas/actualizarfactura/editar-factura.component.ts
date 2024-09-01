import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FacturaService } from 'src/app/Services/factura.service';
import { IFactura } from 'src/app/Interfaces/factura';

@Component({
  selector: 'app-editar-factura',
  templateUrl: './editar-factura.component.html',
  styleUrls: ['./editar-factura.component.scss']
})
export class EditarFacturaComponent implements OnInit {
  frm_factura: FormGroup;
  facturaId: number;
  factura: IFactura;

  constructor(
    private facturaService: FacturaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.facturaId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.frm_factura = new FormGroup({
      Fecha: new FormControl('', Validators.required),
      Sub_total: new FormControl('', Validators.required),
      Sub_total_iva: new FormControl('', Validators.required),
      Valor_IVA: new FormControl('0.15', Validators.required),
      Clientes_idClientes: new FormControl('', Validators.required)
    });

    this.facturaService.uno(this.facturaId).subscribe({
      next: (data) => {
        this.factura = data;
        this.frm_factura.patchValue(this.factura);
      },
      error: (e) => console.log(e)
    });
  }

  actualizar() {
    const updatedFactura: IFactura = {
      ...this.factura,
      ...this.frm_factura.value
    };

    this.facturaService.actualizar(updatedFactura).subscribe((respuesta) => {
      if (parseInt(respuesta) > 0) {
        alert('Factura actualizada');
        this.router.navigate(['/facturas']);
      }
    });
  }
}
