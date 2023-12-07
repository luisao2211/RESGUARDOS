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
  timeDay:Boolean = false
  isAnimateMenu:Boolean = false
  items: MenuItem[] | undefined;
  isExpanded = false;
  roleTypeUser:any = localStorage.getItem('role')
  users: any[]=[];
  listUsers:any[]=[]
  selectedUser:Boolean[]=[
  true, false,false,false
  ];
  selectedItemMenu:Boolean[]=[
    false, false, false
  ]
selected: any;
  constructor(private service:ServiceService<any>,private router: Router){
    this.GetUsers()
    this.roleTypeUser = parseInt(this.roleTypeUser)
    this.service.data$.subscribe((data:any) => {
      
     this.GetUsers()
    });
  }
  changeTimeday() {
    if (this.isExpanded) {
        this.isExpanded = false
    }
    this.timeDay = !this.timeDay; 
    console.log("time", this.timeDay); 
  }
  
  GetUsers(role:any = null){
    this.service.Data<any>(`users${role != null ? `/${role}` : ''}`).subscribe({
      next:(n:any)=>{
        this.listUsers = n['data']['result']

        this.users = n['data']['result']

      }
    })
  }
  selectedEmployed(index:number){
    this.selected = index
  }
  toggleContent(): void {
    this.isExpanded = !this.isExpanded;
  }
  changeUserSelected(selected:number): void {
    for (let i = 0; i < this.selectedUser.length; i++) {
      this.selectedUser[i]=false;

    }
    this.selected = null
    this.selectedUser[selected] = true;
    if (selected +1>1) {
      this.GetUsers(selected +1)
    }
    else{
      this.GetUsers()
    }

  }
  changeItemSelected(selected:number): void {
    for (let i = 0; i < this.selectedItemMenu.length; i++) {
      this.selectedItemMenu[i]=false;

    }
  
    this.selectedItemMenu[selected] = true;
  }
  Logout() {
  this.service.Logout('auth/logout').subscribe({
    next:(n:any)=>{
      localStorage.removeItem('token')
      localStorage.removeItem('id')
      localStorage.removeItem('role')

      this.router.navigateByUrl('');

    },
    error:(e:any)=>{

    }
  })
  }
  searchUser(event:any) {
    this.selected = null  
    if (event.target.value.length > 1) {
      this.users = this.users.filter(u => typeof u.payroll === 'number' && u.payroll.toString().includes(event.target.value));
    }
    else{
      this.users =  this.listUsers
    }
  
    }
}
