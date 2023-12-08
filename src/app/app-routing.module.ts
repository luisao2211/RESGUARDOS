import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardUsersComponent } from './components/dashboard-users/dashboard-users.component';
import { LoginComponent } from './components/login/login.component';
import { UsersreguardsComponent } from './components/usersreguards/usersreguards.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { AuthenticationGuard } from './auth.guard';
import { AcessGuard } from './access.guard';
import { UsersComponent } from './components/users/users.component';
import { UserResguardsComponent } from './components/user-resguards/user-resguards.component';

const routes: Routes = [
  {path:"",component:LoginComponent,
  canActivate:[AuthenticationGuard]

},
{
  path:"",component:DashboardUsersComponent,
  canActivate:[AcessGuard],
  children:[
  {
    path: 'Resguardos',
        pathMatch: 'full',
        component:UsersreguardsComponent
  },
  {
    path: 'Administrativo',
        pathMatch: 'full',
        component:DashboardAdminComponent,
      

  },
  {
    path:'Usuarios',
    pathMatch: 'full',
    component:UsersComponent
  },
  {
    path:'ResguardosUsuarios/:id',
    component:UserResguardsComponent
  }
  ]

},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
