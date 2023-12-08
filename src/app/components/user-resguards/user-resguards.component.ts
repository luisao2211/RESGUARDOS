import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'jspdf-autotable';
import { ServiceService } from 'src/app/service.service';

interface Option {
  id: number;
  text: string;
}
@Component({
  selector: 'app-user-resguards',
  templateUrl: './user-resguards.component.html',
  styleUrls: ['./user-resguards.component.css']
})
export class UserResguardsComponent  implements OnInit, OnDestroy   {
  @ViewChild('dt') table!: Table; 

  userId: string|null;
  name!:string
  group!:string
  payroll!:string
visible: boolean = false;
options: Option[] = [
 
];
data:any
filteredOptions: Option[] = []; // Opciones filtradas para mostrar en el dropdown
searchText = ''; // Texto de búsqueda ingresado por el usuario
showDropdown = false; // Variable para controlar la visibilidad del dropdow
selected? : number| null
loading: boolean|undefined;
  constructor(private route: ActivatedRoute,private service:ServiceService<any>){
    this.userId = this.route.snapshot.paramMap.get('id');  }
  showDialog(){
    this.visible = true
  }
  ngOnInit(): void {
   
    this.route.params.subscribe(params => {

      this.userId = params['id'];
      this.GetData()
      this.service.Data<any>(`user/${this.userId}`).subscribe({
        next:(n:any)=>{
            this.name = n['data']['result']['name']
            this.group = n['data']['result']['group']
            this.payroll = n['data']['result']['payroll']
  
        },
        error:(e:any)=>{
  
        }
      })
      this.service.Data<Option>('guards/showOptions').subscribe({
        next:(n:any)=>{
          this.options = n['data']['result']
        },
        error:(e)=>{

        }
      })
    });
  }

  ngOnDestroy(): void {
    // Limpiar datos al destruir el componente
    this.data = [];
    // Cancelar la suscripción al parámetro de la ruta para evitar memory leaks
  
  }
  onSearch(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredOptions = this.options.filter(option => option.text.toLowerCase().includes(searchText));
  }
  
  showAllOptions(): void {
    this.filteredOptions = this.options; // Muestra todas las opciones al hacer clic en el input
    this.showDropdown = true;
  }
  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false; // Oculta el dropdown después de un breve retraso al perder el foco
    }, 200);
  }

  selectOption(option: Option): void {
    this.searchText = option.text; // Establece el valor seleccionado en el input
    this.showDropdown = false; // Oculta el dropdown después de seleccionar una opción
    this.selected= option.id
  }
  Sumbit() {
    this.loading = true
    let json = {}
    if (this.userId !== null) {
       json = {
        guard_id: this.selected,
        user_id: parseInt(this.userId)
      };
    }
    this.service.Post<any>('usersguards/create',json).subscribe({
      next:(n:any)=>{
        this.loading = false

      },
      error:(n:any)=>{
        this.loading = false

      }
    })
  }

  GetData(){
    this.loading = true

    this.service.Data<any>(`usersguards/guardsUser/${this.userId}`).subscribe({
      next:(n:any)=>{
        this.loading = false
          this.data =n['data']['result']
          console.log(this.data)
      },
      error:(n:any)=>{
        this.loading = false

      }
    })
  }
///usersguards/guardsUser
}
