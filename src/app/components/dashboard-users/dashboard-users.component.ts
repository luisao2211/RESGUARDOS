import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-users',
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.css']
})
export class DashboardUsersComponent {
   isAnimateMenu:Boolean = false
  
   animateMenu(){
    console.log("this.isAnimateMenu",this.isAnimateMenu);
    this.isAnimateMenu = !this.isAnimateMenu
    console.log("this.isAnimateMenu",this.isAnimateMenu);

  }
}
