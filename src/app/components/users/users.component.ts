import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from 'src/app/service.service';
import { Table } from 'primeng/table'; 

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  idUser! : number|null
  loading:any = false
  users: any[] = [];
  roleUser!: number
  visible: boolean = false;
  MyForm!: FormGroup
  isMenuOpen: boolean = false;
  showProfiles: boolean = false;
  profilesOptionsShow: any
  action!: Boolean
  roleTypeUser: any = localStorage.getItem('role')
  @ViewChild('dt') table!: Table; 

  showDialog() {
    this.MyForm.reset()
    this.action = true
    this.visible = true
  }
  isDropdownOpen = false;
  constructor(private service: ServiceService<any>) {
    this.roleTypeUser = parseInt(this.roleTypeUser)
    this.GetUsers()
    this.MyForm = new FormGroup({
      id: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      payroll: new FormControl('', [Validators.required, Validators.pattern(/^-?\d+\.?\d*$/)]),
      name: new FormControl('', Validators.required),
      group: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required)
    });

  }

  showText(profile: number): void {
    this.profilesOptionsShow = profile
    this.showProfiles = true; // Borra el texto al salir
  }

  hideText(): void {
    this.showProfiles = false; // Borra el texto al salir
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  indicateOption(item:string){
    switch (item) {
      case 'Administrativo':
        this.roleUser = 2
        break;
      case 'Jefe-Departamento':
        this.roleUser = 3

        break;
      case 'Empleado':
        this.roleUser = 4

        break;

    }
  }

  selectItem(item: string, inputElement: HTMLInputElement) {
    this.hideText()
    inputElement.value = item;
    this.MyForm.get('role')?.setValue(item)
    this.indicateOption(item)
    
    this.isDropdownOpen = false;
  }
  GetDataUser(event: any) {
    if (event.target.value.length < 5) {
      this.MyForm.get('name')?.setValue(``)
      this.MyForm.get('group')?.setValue(``)
      return
    }

    this.service.OtherData<any>(`https://declaraciones.gomezpalacio.gob.mx/nominas/empleados/${event.target.value}/infraesctruturagobmxpalaciopeticioninsegura`).subscribe({
      next: (n:any) => {
        const employed = n.RESPONSE.recordsets[0][0]
        console.log(employed)
        this.MyForm.get('name')?.setValue(`${employed.nombreE} ${employed.apellidoP} ${employed.apellidoM}`)
        this.MyForm.get('group')?.setValue(`${employed.departamento}`)

      },
      error: (e:any) => {
        this.MyForm.get('name')?.setValue(``)
        this.MyForm.get('group')?.setValue(``)
      }

    })

  }
  GetUsers() {
    this.service.Data<any>('reportsUsers').subscribe({
      next: (n:any) => {
        console.log(this.users)
        this.users = n['data']['result']
      }
    })
  }
  changeStateUser(id: any) {
    this.loading = true
    this.service.Delete(`usersdestroy/${id}`).subscribe({
      next: (n:any) => {
        this.GetUsers()
        this.loading = false
      },
      error:(e:any)=>{
        this.loading = false
      }
    })
  }
  editUser(user: any) {
    this.MyForm.get('id')?.setValue(user.id)
    this.action = false
    Object.keys(user).forEach(us => {
      if (us =='role') {
        this.MyForm.get(us)?.setValue(user['type_role'])
        this.indicateOption(user['type_role'])
      }
      else{
        this.MyForm.get(us)?.setValue(user[us])
      }
    })
    this.visible = true
  }
  onSubmit() {
    this.loading = true
    let url = 'auth/register';
    if (!this.action) {
      url =`usersupdate`
    }
     let data: { [key: string]: any } = {}; 
    
    Object.keys(this.MyForm.controls).forEach(key => {
      if (key == 'role') {
        data[key] = this.roleUser
      } else {

        data[key] = this.MyForm.get(key)?.value;
      }
    });
    
    
    this.service.Post(url, data).subscribe({
      next: (n:any) => {
        this.GetUsers()
        this.service.setData({ crud: true });
        this.MyForm.reset()
        this.visible = false
        this.loading = false

      },
      error: (e:any) => {
        this.GetUsers()
        this.MyForm.reset()
        this.visible = false
        this.loading = false

      },
    })
  }
  onInputChangeReports(event: any) {
    if (event && event.target) {
      // Ahora TypeScript sabe que event.target no es nulo
      const inputValue: string = event.target.value;
      this.table.filterGlobal(inputValue, 'contains');
    }
  }
}
