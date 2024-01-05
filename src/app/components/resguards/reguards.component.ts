import {Component, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';

// import * as xlsx from 'xlsx';
import 'jspdf-autotable';

import { ServiceService } from 'src/app/service.service';
import { Route, Router } from '@angular/router';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

interface Option {
  departamento: string;
}

@Component({
  selector: 'app-reguards',
  templateUrl: './reguards.component.html',
  styleUrls: ['./reguards.component.css']
})
export class ReguardsComponent  {




    groups:any=[]
  cols!: Column[];
    selectedColumns!: Column[];
     Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  exportColumns!: ExportColumn[];
  addTr: number = 0;
  inputsForm: any = [];
  MyForm!: FormGroup;
  myFormUpdate!: FormGroup;
  first = 0;
  imagePreview: string | ArrayBuffer | null = null;
   resguardSelected!:string|null
  @ViewChild('dt') table!: Table;
  @ViewChild('dt1') tableReports!: Table;
  filteredOptions: Option[] = []; // Opciones filtradas para mostrar en el dropdown
  searchText = ''; // Texto de búsqueda ingresado por el usuario
  showDropdown = false;
  loading: boolean = false;
  action:'edit'|'insert'='insert'

  rows = 10;
  guards: any = [

  ]

 guardSave:any =[]
  conteo: number = 0;
  modal: boolean = false;
  options:boolean = false;
  
  @ViewChild('fileInput') fileInput!: ElementRef;

  value:any;
  clonedProducts: { [s: string]: any } = {};
  editing: any;
  brand = localStorage.getItem('brand') !== null ? localStorage.getItem('brand') : ''; //marca
  type = localStorage.getItem('type') !== null ? localStorage.getItem('type') : ''; //tipo
  state = localStorage.getItem('state') !== null ? localStorage.getItem('state') : ''; //estado fisico

  serial = localStorage.getItem('serial') !== null ? localStorage.getItem('serial') : ''; //serial
  airlne = localStorage.getItem('airlne') !== null ? localStorage.getItem('airlne') : ''; //aerea de adscripcion
  numberNomina = localStorage.getItem('numberNomina') !== null ? localStorage.getItem('numberNomina') : ''; //aerea de adscripcion
  checked = localStorage.getItem('checked') !== null ? false : true;
  dialogmodal: boolean= false;
  history: any=[];
  selected? : string| null
  //numero de nomina

  constructor(private fb: FormBuilder,private service:ServiceService<any>,private route:Router) {
    this.MyForm = new FormGroup({
      id: new FormControl(''),
      picture:new FormControl('',Validators.required),
      type:new FormControl('',Validators.required),
      description:new FormControl('',Validators.required),
      brand:new FormControl('',Validators.required),
      state:new FormControl('',Validators.required),
      serial:new FormControl('',Validators.required),
      
      airlane:new FormControl('',Validators.required),
      group:new FormControl('',Validators.required),
      observations:new FormControl(''),
    });
   
    this.GetDataGroups()
    this.cols = [
      { field: 'payroll', header: 'NUMERO DE NOMINA', customExportHeader: 'NUMERO DE NOMINA' },
      { field: 'name', header: 'NOMBRE DEL RESGUARDANTE', customExportHeader: 'NOMBRE DEL RESGUARDANTE' },
      { field: 'group', header: 'UBICACIÓN O DEPARTAMENTO', customExportHeader: 'UBICACIÓN O DEPARTAMENTO' },
      { field: 'airlane', header: 'AEREA DE ADSCRIPCIÓN', customExportHeader: 'AEREA DE ADSCRIPCIÓN' },
      { field: 'dateup', header: 'FECHA DE ASIGNACIÓN DEL RESGUARDO', customExportHeader: 'FECHA DE ASIGNACIÓN DEL RESGUARDO' },
      { field: 'datedown', header: 'FECHA DE ENTREGA DEL RESGUARDO', customExportHeader: 'FECHA DE ENTREGA DEL RESGUARDO' },
      { field: 'observation', header: 'OBSERVACIONES', customExportHeader: 'OBSERVACIONES' },


  ];

  this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  this.getGuards()
  }
  showTableReport(guard:any){
    this.resguardSelected = guard.description
    this.service.Data<any>(`guards/history/${guard.id}`).subscribe({
      next: (n:any) => {
        this.history = n['data']['result']
        this.dialogmodal = true
      }
    })
  }
 
  clearFileInput() {
    this.fileInput.nativeElement.value = '';
  }

showDialog(){
  this.imagePreview = null
  this.clearFileInput()
  this.MyForm.reset()
  this.action = 'insert'
  this.modal = true
}
onFileSelected(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const file = inputElement.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    this.onFileChangeUpdate(event)
    };
    reader.readAsDataURL(file);
  } else {
    this.imagePreview = null;
  }
}

openFileInput() {
  this.fileInput.nativeElement.click();
}

onFileChange(event: any, index: number): void {
  console.log(index)
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const base64String = e.target.result.split(',')[1];
      this.MyForm.get('img' + index)?.setValue(base64String);
      this.MyForm.get('picture' + index)?.setValue(event.target.files)
    };

    reader.readAsDataURL(file);
  }
}
onFileChangeUpdate(event: any): void {

      this.MyForm.get('picture')?.setValue(event.target.files)



}
onInputChange(event: any) {
  if (event && event.target) {
    const inputValue: string = event.target.value;
    this.tableReports.filterGlobal(inputValue, 'contains');
  }
}

GetDataGroups() {


  this.service.OtherData<any>(`https://declaraciones.gomezpalacio.gob.mx/nominas/departamentos/infraesctruturagobmxpalaciopeticioninsegura`).subscribe({
    next: (n:any) => {
       this.groups = n.RESPONSE.recordsets[0]
    },
    error: (e:any) => {
     
    }

  })

}
showAllOptions(): void {
  this.filteredOptions = this.groups;
  this.showDropdown = true;
}
onBlur(): void {
  setTimeout(() => {
    this.showDropdown = false;
  }, 200);
}
onSearch(event: Event): void {
  const searchText = (event.target as HTMLInputElement).value.toLowerCase();

  this.filteredOptions = this.groups.filter(option => option.departamento.toLowerCase().includes(searchText));
}
selectOption(option: Option): void {
  this.searchText = option.departamento;
  this.showDropdown = false;
  this.selected= option.departamento
}
exportExcel() {
  import('xlsx').then((xlsx) => {
    const columnKeys = this.exportColumns.map((column) => column.title);

    // Crear una copia de this.guards para no modificar el original directamente
    const modifiedGuards = this.history.map((guard: { [x: string]: any; }) => {
      const modifiedGuard: any = {};
      for (const key in guard) {
        // Buscar una coincidencia en column.dataKey
        const matchingColumn = this.exportColumns.find((column) => column.dataKey === key);
        if (matchingColumn) {
          // Si hay una coincidencia, usa column.title como nueva clave
          modifiedGuard[matchingColumn.title] = guard[key];
        }
      }
      return modifiedGuard;
    });

    const worksheet = xlsx.utils.json_to_sheet(modifiedGuards, { header: columnKeys });
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Resguardos');
  });
}





saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data,this.resguardSelected+ EXCEL_EXTENSION);
}

  onSubmit() {

    this.loading = true;

    const formData = this.MyForm.value;
    const form = new FormData();

    for (const key of Object.keys(formData)) {

      if (key.includes('picture')) {
        const files = formData[key];
        if (files && files.length > 0) {
          const file = files[0];
          const newKey = `${key}`;
          form.append(newKey, file);
        }

      } else {
        form.append(key, formData[key]);
      }
    }




    let url = 'guards'
    if (this.action !='insert') {
      url = 'guards/update'
    }

    this.service.Post(url,form).subscribe({
      next:(n:any)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `Se ha ${url =='guards'?'insertado':'actualizado'} correctamente`,
        });
       },
      error:(e:any)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: ` No se ha podido ${url =='guards'?'insertar':'actualizar'}`,
        });
        this.modal = false
        this.MyForm.reset()
        this.clearFileInput()

      },
      complete:()=>{
        // this.table.reset()
        this.action ='insert'
        this.loading = false;
        if (this.checked||this.action !='insert') {
          this.MyForm.reset()
          this.clearFileInput()
          this.modal = false
        }
        else{
          this.myFormUpdate.get(`picture`)?.setValue('');
          this.myFormUpdate.get(`description`)?.setValue('');
          this.myFormUpdate.get(`observations`)?.setValue('');

          this.clearFileInput()
        }
        this.getGuards()

      }
    })

  }

  
  getGuards(){
    this.loading = true;

    this.service.Data<any>("guards").subscribe({
      next:(n:any)=>{
        this.guardSave =n['data']["result"]

      },
      error:(e:any)=>{
        this.loading = false;

      },
      complete:()=>{

        this.loading = false;

      }
    })
  }
  removeGuard(id:number){
    this.loading = true
    this.service.Delete(`guardsdestroy/${id}`).subscribe({
      next:(n:any)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `se ha eliminado correctamente`,
        });
      },
      error:(e:any)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: `no se ha podido eliminar`,
        });
        this.loading = false

      },
      complete:()=>{
        this.loading = false
        this.getGuards()
      }
    })
  }

 searchEmployeed(event:any ){
  this.service.OtherData<any>(`https://declaraciones.gomezpalacio.gob.mx/nominas/empleados/${event.target.value}/infraesctruturagobmxpalaciopeticioninsegura`).subscribe({
  next:(n:any)=>{
    const employed = n.RESPONSE.recordsets[0][0]
    console.log(employed)
    this.myFormUpdate.get('employeed')?.setValue(`${employed.nombreE} ${employed.apellidoP} ${employed.apellidoM}`)
    this.myFormUpdate.get('group')?.setValue(`${employed.departamento}`)

  },
  error:(e:any)=>{
    this.myFormUpdate.get('employeed')?.setValue(``)
    this.myFormUpdate.get('group')?.setValue(``)
  }

  })
 }
 Close(){
  this.options = false


 }
 Destroy(){
  localStorage.removeItem('brand')
  localStorage.removeItem('type')
  localStorage.removeItem('state')
  localStorage.removeItem('serial')
  localStorage.removeItem('airlne')
  localStorage.removeItem('numberNomina')
  localStorage.removeItem('checked')

  this.brand = null
  this.type = null
  this.state =null
  this.serial = null
  this.airlne = null
  this.numberNomina = null
  this.myFormUpdate.get('brand')?.setValue('')
  this.myFormUpdate.get('type')?.setValue('')
  this.myFormUpdate.get('state')?.setValue('')
  this.myFormUpdate.get('serial')?.setValue('')
  this.myFormUpdate.get('payroll')?.setValue('')
  this.myFormUpdate.get('airlne')?.setValue('')


  this.options = false
 }
 onInputChangeReports(event: any) {
  if (event && event.target) {
    // Ahora TypeScript sabe que event.target no es nulo
    const inputValue: string = event.target.value;
    this.table.filterGlobal(inputValue, 'contains');
  }
}
changeResguardState(guard: any) {
  let pass = true

    Object.keys(guard).forEach((g:any,index) => {
          if (guard[g] == undefined && g!== 'motive' || guard[g] == null && g !== 'motive') {
            pass = false
        
            this.Toast.fire({
              icon: "warning",
              title: "No se puede activar debido a que no contiene su información necesaria"
            });
          }
          if (index == Object.keys(guard).length -1  && pass) {
            console.log(guard)

           if (guard.active ==1) {
            Swal.fire({
              title: 'Motivo de la baja',
              input: 'text',
              inputPlaceholder: 'Ingresa el motivo',
              showCancelButton: true,
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Eliminar',
              preConfirm: (motivo) => {
                if (!motivo) {
                  Swal.showValidationMessage('Debes ingresar un motivo');
                }
                return motivo;
              }
            }).then((motivoResult) => {
              if (motivoResult.isConfirmed) {
                const json = {
                  motive:motivoResult.value
                }
               
            this.service.Post(`guardsdestroy/${guard.id}`,json).subscribe({
              next:()=>{
                this.getGuards()
                this.Toast.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: `se a cambiado el estado`,
                });
              },
              error:()=>{
                this.getGuards()
                if (guard.active == 1) {
                  this.Toast.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `no se puede dar de baja ya que esta en uso`,
                  });
                }
              }
           })
              }
            });
           }
           else{
            this.service.Post(`guardsdestroy/${guard.id}`,{}).subscribe({
              next:()=>{
                this.getGuards()
                this.Toast.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: `se a cambiado el estado`,
                });
              },
              error:()=>{
                this.getGuards()
                console.log(guard)
                if (guard.active == 1) {
                  this.Toast.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `no se puede dar de baja ya que esta en uso`,
                  });
                }
              }
           })
           }


         
          }
      });




  }
  print(guard: any) {
    this.service.setData({guard})
    this.route.navigate(['/Ticket'])
  }
  

  EditGuard(guard:any){
    this.MyForm.get('id')?.setValue(guard.id)
    this.action = 'edit'
    Object.keys(guard).forEach(key => {
      if (this.MyForm.get(key)) {
        this.MyForm.get(key)?.setValue(guard[key]);
      }
      if (key == 'picture') {
        this.imagePreview = guard[key]
      }
    });

    this.modal = true
  }
}


