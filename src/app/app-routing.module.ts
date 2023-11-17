import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardUsersComponent } from './components/dashboard-users/dashboard-users.component';
import { LoginComponent } from './components/login/login.component';
import { UsersreguardsComponent } from './components/usersreguards/usersreguards.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { AuthenticationGuard } from './auth.guard';
import { AcessGuard } from './access.guard';

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
        component:DashboardAdminComponent
  }
  ]

},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
