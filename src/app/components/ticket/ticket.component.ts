import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  guard:any
  myAngularxQrCode!: string; // Datos que se codificarán en el código QR
  constructor(private service:ServiceService<any>,private route:Router){

  }
  ngOnInit(): void {
    this.service.data$.subscribe((data: any) => {
    
      if (!data) {
        this.route.navigate(['Resguardos']);
      } else {
        this.guard = data;
        if (this.guard && this.guard.guard && this.guard.guard.id) {
          this.myAngularxQrCode = `https://resguardosinternos.gomezpalacio.gob.mx/#/Informacion/${this.guard.guard.id}`;
        } 
      }
    });
    
  }
  
   

onChangeURL(event: any) {
}

}
