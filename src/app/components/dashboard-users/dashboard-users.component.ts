import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-dashboard-users',
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.css']
})
export class DashboardUsersComponent {
  isAnimateMenu:Boolean = false
  items: MenuItem[] | undefined;
  constructor(private service:ServiceService<any>,private router: Router){}
  animateMenu(){
    console.log("this.isAnimateMenu",this.isAnimateMenu);
    this.isAnimateMenu = !this.isAnimateMenu
    console.log("this.isAnimateMenu",this.isAnimateMenu);
    
  }
  
  Logout() {
  this.service.Logout('auth/logout').subscribe({
    next:(n)=>{
      localStorage.removeItem('token')
      localStorage.removeItem('id')
      localStorage.removeItem('role')

      this.router.navigateByUrl('');

    },
    error:(e)=>{

    }
  })
  }
}
