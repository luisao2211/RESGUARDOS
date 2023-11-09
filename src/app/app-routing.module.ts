import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardUsersComponent } from './components/dashboard-users/dashboard-users.component';
import { LoginComponent } from './components/login/login.component';
import { UsersreguardsComponent } from './components/usersreguards/usersreguards.component';

const routes: Routes = [
  {path:"",component:LoginComponent},
{
  path:"",component:DashboardUsersComponent,
  children:[
  {
    path: 'Resguardos',
        pathMatch: 'full',
        component:UsersreguardsComponent
  }
  ]

},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
