import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  users: any[]=[];
roleUser!:number
visible: boolean=false;
MyForm!: FormGroup
isMenuOpen: boolean = false;
showProfiles: boolean= false;
profilesOptionsShow :any
roleTypeUser:any = localStorage.getItem('role')
showDialog() {
this.visible = true
}
isDropdownOpen = false;
constructor(private service:ServiceService<any>){
  this.roleTypeUser = parseInt(this.roleTypeUser)
  this.GetUsers()
  this.MyForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    payroll: new FormControl('', [Validators.required,Validators.pattern(/^-?\d+\.?\d*$/)]),
    name:new FormControl('',Validators.required),
    group:new FormControl('',Validators.required),
    role:new FormControl('',Validators.required)       
  });
  
}

showText(profile:number): void {
  this.profilesOptionsShow = profile
  this.showProfiles =true; // Borra el texto al salir
}

hideText(): void {
  this.showProfiles =false; // Borra el texto al salir
}


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectItem(item: string, inputElement: HTMLInputElement) {
    this.hideText()
    inputElement.value = item;
    this.MyForm.get('role')?.setValue(item)

    switch(item){
      case 'Administrativo':
      this.roleUser =2
      break;
      case 'Jefe-Departamento':
        this.roleUser =3

      break;
      case 'Empleado':
        this.roleUser =4

      break;

    } 
    this.isDropdownOpen = false; 
  }
  GetDataUser(event:any) {
    if (event.target.value.length < 5) {
        this.MyForm.get('name')?.setValue(``)
        this.MyForm.get('group')?.setValue(``)
        return
    }
    
      this.service.OtherData<any>(`https://declaraciones.gomezpalacio.gob.mx/nominas/empleados/${event.target.value}/infraesctruturagobmxpalaciopeticioninsegura`).subscribe({
      next:(n)=>{
        const employed = n.RESPONSE.recordsets[0][0]
        console.log(employed)
        this.MyForm.get('name')?.setValue(`${employed.nombreE} ${employed.apellidoP} ${employed.apellidoM}`)
        this.MyForm.get('group')?.setValue(`${employed.departamento}`)
    
      },
      error:(e)=>{
        this.MyForm.get('name')?.setValue(``)
        this.MyForm.get('group')?.setValue(``)
      }
    
      })

  }
  GetUsers(){
    this.service.Data<any>('users').subscribe({
      next:(n)=>{
        this.users = n['data']['result']
      }
    })
  }
  removeUser(id:any){
    this.service.Delete(`usersdestroy/${id}`).subscribe({
      next:(n)=>{
        this.GetUsers()
      }
    })
  }
  onSubmit() {
    this.visible =false
    let data: { [key: string]: any } = {}; // Se define el tipo explícitamente como un objeto con claves de tipo string y valores de cualquier tipo
      // Recorre cada campo del formulario
      Object.keys(this.MyForm.controls).forEach(key => {
        if(key =='role'){
          data[key]= this.roleUser
        }else{

          data[key] = this.MyForm.get(key)?.value;
        }
      });
      this.service.Post('auth/register',data).subscribe({
        next:(n)=>{
          this.GetUsers()
          this.service.setData({ crud:true });

        },
        error:(e)=>{
          this.GetUsers()

        },
      })
  }
  
}
