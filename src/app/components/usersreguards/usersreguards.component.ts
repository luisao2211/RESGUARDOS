import {AfterViewInit, Component, ViewChild, ChangeDetectorRef, NgZone, OnInit, ElementRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { Table } from 'primeng/table'; 
import * as FileSaver from 'file-saver';
import * as jsPDF from 'jspdf';
// import * as xlsx from 'xlsx';
import { autoTable } from 'jspdf-autotable';
import 'jspdf-autotable';

import { log } from 'handsontable/helpers';
import { ServiceService } from 'src/app/service.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}


@Component({
  selector: 'app-usersreguards',
  templateUrl: './usersreguards.component.html',
  styleUrls: ['./usersreguards.component.css']
})
export class UsersreguardsComponent  {



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

  @ViewChild('dt') table!: Table; 
  @ViewChild('dt1') tableReports!: Table; 

  loading: boolean = false;
  action:'edit'|'insert'='insert' 

  rows = 10;
  guards: any = [
   
  ]
  
 guardSave:any =[]
  conteo: number = 0;
  visible: boolean = false;
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
  dialogVisible: boolean= false;
  //numero de nomina

  constructor(private fb: FormBuilder,private service:ServiceService<any>) {
    console.warn(this.checked,typeof(this.checked))
    this.MyForm = new FormGroup({
      id: new FormControl(''),
      picture:new FormControl('',Validators.required),
      type:new FormControl('',Validators.required),
      description:new FormControl('',Validators.required),
      brand:new FormControl('',Validators.required),
      state:new FormControl('',Validators.required),
      serial:new FormControl('',Validators.required),
      airlane:new FormControl('',Validators.required),
      observations:new FormControl(''),
    });
    // this.myFormUpdate = new FormGroup({  } )
    // this.myFormUpdate.addControl(`id`,new FormControl(''))
    //   this.myFormUpdate.addControl(`picture`,new FormControl('',Validators.required))
    //   this.myFormUpdate.addControl(`description`,new FormControl('',Validators.required))

    //   this.myFormUpdate.addControl(`brand`,new FormControl(localStorage.getItem('brand') !== null ? localStorage.getItem('brand') : '',Validators.required))
    //   this.myFormUpdate.addControl(`type`,new FormControl(localStorage.getItem('type') !== null ? localStorage.getItem('type') : ''))
    //   this.myFormUpdate.addControl(`state`,new FormControl(localStorage.getItem('state') !== null ? localStorage.getItem('state') : '',Validators.required))
    //   this.myFormUpdate.addControl(`serial`,new FormControl(localStorage.getItem('serial') !== null ? localStorage.getItem('serial') : '',Validators.required))
    //   this.myFormUpdate.addControl(`airlne`,new FormControl(localStorage.getItem('airlne') !== null ? localStorage.getItem('airlne') : '',Validators.required))
    //   this.myFormUpdate.addControl(`payroll`,new FormControl(localStorage.getItem('numberNomina') !== null ? localStorage.getItem('numberNomina') : '',Validators.required))
    //   this.myFormUpdate.addControl(`group`,new FormControl('',Validators.required))

    //   this.myFormUpdate.addControl(`employeed`,new FormControl('',Validators.required))
    //   this.myFormUpdate.addControl(`date`,new FormControl(new Date().toISOString().slice(0, 10),Validators.required))
    //   this.myFormUpdate.addControl(`observations`,new FormControl(''))


  //   this.cols = [
  //     { field: 'stock_number', header: 'NUMERO DE INVENTARIO', customExportHeader: 'Emisor' },
  //     { field: 'description', header: 'NOMBRE O DESCRIPCIÓN	', customExportHeader: 'Emisor' },
  //     { field: 'brand', header: 'MARCA Y MODELO', customExportHeader: 'Descripción del producto' },
  //     { field: 'type', header: 'TIPO', customExportHeader: 'Cantidad o Pieza' },
  //     { field: 'state', header: 'NUMERO DE SERIE', customExportHeader: 'Valor' },
  //     { field: 'serial', header: 'ESTADO FISICO', customExportHeader: 'Nombre del resguardante' },
  //     { field: 'airlne', header: 'ÁEREA DE ADSCRIPCION', customExportHeader: 'Departamento' },
  //     { field: 'payroll', header: 'NUMERO DE NOMINA', customExportHeader: 'Numero consecutivo' },
  //     { field: 'group', header: 'UBICACIÓN/DEPARTAMENTO', customExportHeader: 'Numero de etiqueta' },
  //     { field: 'employeed', header: 'NOMBRE DEL RESGUARDANTE', customExportHeader: 'Numero de nomina' },
  //     { field: 'date', header: 'FECHA DE ASIGNACIÓN DEL RESGUARDO', customExportHeader: 'Numero de nomina' },
  //     { field: 'observations', header: 'OBSERVACÍONES', customExportHeader: 'Numero de nomina' },

  // ];

  // this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  this.getGuards()
  }
  showTableReport(){
    this.dialogVisible = true
  }
  // changeBrand(event:any){
  //   this.myFormUpdate.get('brand')?.setValue(event.target.value)
  //   localStorage.setItem("brand", event.target.value == null ? '' : event.target.value);
 
  // }
  // changeType(event:any){
  //   this.myFormUpdate.get('type')?.setValue(event.target.value)
  //   localStorage.setItem("type", event.target.value == null ? '' : event.target.value);

  // }
  // changeSerial(event:any){
  //   this.myFormUpdate.get('serial')?.setValue(event.target.value)
  //   localStorage.setItem("serial", event.target.value == null ? '' : event.target.value);

  // }
  // changeState(event:any){
  //   this.myFormUpdate.get('state')?.setValue(event.target.value)
  //   localStorage.setItem("state", event.target.value == null ? '' : event.target.value);

  // }
  // changeAirlne(event:any){
  //   this.myFormUpdate.get('airlne')?.setValue(event.target.value)
  //   localStorage.setItem("airlne", event.target.value == null ? '' : event.target.value);

  // }
  // changeNumberNomina(event:any){
  //   this.myFormUpdate.get('payroll')?.setValue(event.target.value)
  //   localStorage.setItem("numberNomina", event.target.value == null ? '' : event.target.value);
  //   this.searchEmployeed(event)
  // }
  // onSwitchChange(event: any) {
  //   this.checked =!this.checked
  //   if (!this.checked) {
  //       localStorage.setItem("checked",JSON.stringify(false))
  //   }else{
  //     localStorage.removeItem("checked")
  //   }
  // }
  clearFileInput() {
    this.fileInput.nativeElement.value = '';
  }
//   next() {
//     this.first = this.first + this.rows;
//   }

//   prev() {
//     this.first = this.first - this.rows;
// }

// reset() {
//     this.first = 0;
//   }
//   pageChange(event:any) {
//     this.first = event.first;
//     this.rows = event.rows;
//   }
  
//   isLastPage(): boolean {
//     return this.guards ? this.first === this.guards.length - this.rows : true;
//   }
  
//   isFirstPage(): boolean {
//     return this.guards ? this.first === 0 : true;
//   }
//   onRowEditInit(guards: any) {
//     console.log(guards)
//     this.clonedProducts[guards.idtable as string] = { ...guards };
//   }

// filter(evento:any){
 
// }

// onRowEditSave(idguard: number) {
//   const index = this.guards.findIndex((d: { idtable: number; }) => d.idtable === idguard);

//     this.guards[index]["facture"] = this.myForm.get(`facture${idguard}`)?.value
//     this.guards[index]["emisor"] = this.myForm.get(`emisor${idguard}`)?.value
//     this.guards[index]["description"] = this.myForm.get(`description${idguard}`)?.value
//     this.guards[index]["type"] = this.myForm.get(`type${idguard}`)?.value
//     this.guards[index]["value"] = this.myForm.get(`value${idguard}`)?.value
//     this.guards[index]["name"] = this.myForm.get(`name${idguard}`)?.value
//     this.guards[index]["group"] = this.myForm.get(`group${idguard}`)?.value
//     this.guards[index]["numberconsecutive"] = this.myForm.get(`numberconsecutive${idguard}`)?.value
//     this.guards[index]["label"] = this.myForm.get(`label${idguard}`)?.value
//     this.guards[index]["payroll"] = this.myForm.get(`payroll${idguard}`)?.value
//     console.log(this.guards[index])
   
//     // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
 
//     // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
  
// }

// onRowEditCancel(guards: any, index: number) {
//   this.guards[index] = this.clonedProducts[guards.idtable as string];
//   delete this.clonedProducts[guards.idtable as string];
// }
// onRowDelete(index:number){
//   const idtable = this.guards[index].idtable
//   this.guards.splice(index,1)
//   this.myForm.removeControl(`img${idtable}`)
//   this.myForm.removeControl(`picture${idtable}`)
//   this.myForm.removeControl(`facture${idtable}`)
//   this.myForm.removeControl(`emisor${idtable}`)
//   this.myForm.removeControl(`description${idtable}`)
//   this.myForm.removeControl(`type${idtable}`)
//   this.myForm.removeControl(`value${idtable}`)
//   this.myForm.removeControl(`name${idtable}`)
//   this.myForm.removeControl(`group${idtable}`)
//   this.myForm.removeControl(`numberconsecutive${idtable}`)
//   this.myForm.removeControl(`label${idtable}`)
//   this.myForm.removeControl(`payroll${idtable}`)
//   this.table?.reset();


  
// }

// moreInputs() {
//   if (this.myFormUpdate.get('picture')) {    
//     this.myFormUpdate.removeControl(`picture`)
//   }
//   this.myFormUpdate.addControl(`picture`,new FormControl('',Validators.required))
//   this.myFormUpdate.get(`description`)?.setValue('')
//   this.myFormUpdate.get(`observations`)?.setValue('')
//   this.myFormUpdate.get('employeed')?.setValue(``)
//         this.myFormUpdate.get('group')?.setValue(``)
//   // this.clearFileInput()
//   this.myFormUpdate.get('brand')?.setValue(localStorage.getItem('brand') !== null ? localStorage.getItem('brand') : ''); //marca
//  this.myFormUpdate.get('type')?.setValue(localStorage.getItem('type') !== null ? localStorage.getItem('type') : ''); //tipo
//  this.myFormUpdate.get('state')?.setValue(localStorage.getItem('state') !== null ? localStorage.getItem('state') : ''); //estado fisico
//  this.myFormUpdate.get('serial')?.setValue( localStorage.getItem('serial') !== null ? localStorage.getItem('serial') : ''); //serial
//  this.myFormUpdate.get('airlne')?.setValue(localStorage.getItem('airlne') !== null ? localStorage.getItem('airlne') : ''); //aerea de adscripcion
//  this.myFormUpdate.get('payroll')?.setValue(localStorage.getItem('numberNomina') !== null ? localStorage.getItem('numberNomina') : '');
//  this.myFormUpdate.get(`date`)?.setValue(new Date().toISOString().slice(0, 10))

//   if (localStorage.getItem('numberNomina')) {
    
//     this.service.OtherData<any>(`https://declaraciones.gomezpalacio.gob.mx/nominas/empleados/${localStorage.getItem('numberNomina')}/infraesctruturagobmxpalaciopeticioninsegura`).subscribe({
//       next:(n:any)=>{
//         const employed = n.RESPONSE.recordsets[0][0]
//         console.log(employed)
//         this.myFormUpdate.get('employeed')?.setValue(`${employed.nombreE} ${employed.apellidoP} ${employed.apellidoM}`)
//         this.myFormUpdate.get('group')?.setValue(`${employed.departamento}`)
    
//       },
//       error:(e:any)=>{
//         this.myFormUpdate.get('employeed')?.setValue(``)
//         this.myFormUpdate.get('group')?.setValue(``)
//         this.visible = true
//       },
//       complete:()=>{
//         this.visible = true
      
//       }
//     })
//   }
//   else{

//     this.visible = true
//   }
//   // localStorage.setItem("brand", this.brand == null ? '' : this.brand);
//   // localStorage.setItem("type", this.type == null ? '' : this.type);
//   // localStorage.setItem("serial", this.serial == null ? '' : this.serial);
//   // localStorage.setItem("airlne", this.airlne == null ? '' : this.airlne);
//   // localStorage.setItem("numberNomina", this.numberNomina == null ? '' : this.numberNomina);
//   }
// config() {

//     this.options = true
// }
// addFomControls(){
//   this.myForm.addControl(`img${this.addTr}`,new FormControl(''))
//   this.myForm.addControl(`picture${this.addTr}`,new FormControl('',Validators.required))
//   this.myForm.addControl(`facture${this.addTr}`,new FormControl(''))
//   this.myForm.addControl(`emisor${this.addTr}`,new FormControl(''))
//   this.myForm.addControl(`description${this.addTr}`,new FormControl('',Validators.required))
//   this.myForm.addControl(`type${this.addTr}`,new FormControl('',Validators.required))
//   this.myForm.addControl(`value${this.addTr}`,new FormControl('',Validators.required))
//   this.myForm.addControl(`name${this.addTr}`,new FormControl('',Validators.required))
//   this.myForm.addControl(`group${this.addTr}`,new FormControl('',Validators.required))
//   this.myForm.addControl(`numberconsecutive${this.addTr}`,new FormControl('',Validators.required))
//   this.myForm.addControl(`label${this.addTr}`,new FormControl('',Validators.required))
//   this.myForm.addControl(`payroll${this.addTr}`,new FormControl('',Validators.required))
// }
showDialog(){
  this.visible = true 
}
onFileSelected(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const file = inputElement.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.MyForm.get('picture')?.setValue(inputElement.files)
      console.log(this.MyForm.value)
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
  const file = event.target.files[0];

      this.myFormUpdate.get('picture')?.setValue(event.target.files)
    

  
}
onInputChange(event: any) {
  if (event && event.target) {
    // Ahora TypeScript sabe que event.target no es nulo
    const inputValue: string = event.target.value;
    this.tableReports.filterGlobal(inputValue, 'contains');
  }
}


// exportPdf() {
  

//   import('jspdf').then((jsPDFModule) => {
//     import('jspdf-autotable').then((autoTableModule) => {
//       const jsPDF = jsPDFModule.default;
//       const autoTable = autoTableModule.default;

//       const doc = new jsPDF('l', 'px', 'a4');
//       (doc as any).autoTable({
//         columns: this.exportColumns,
//         body: this.guardSave,
//         styles: {
//           fontSize: 8 // Cambiar el tamaño de la fuente a 8 puntos
//         }
//       });
//       doc.save('Resguardos.pdf');
//     });
//   });
// }
// exportExcel() {
//   import('xlsx').then((xlsx) => {
//     const columnKeys = this.exportColumns.map((column) => column.title);

//     // Crear una copia de this.guards para no modificar el original directamente
//     const modifiedGuards = this.guardSave.map((guard: { [x: string]: any; }) => {
//       const modifiedGuard: any = {};
//       for (const key in guard) {
//         // Buscar una coincidencia en column.dataKey
//         const matchingColumn = this.exportColumns.find((column) => column.dataKey === key);
//         if (matchingColumn) {
//           // Si hay una coincidencia, usa column.title como nueva clave
//           modifiedGuard[matchingColumn.title] = guard[key];
//         }
//       }
//       return modifiedGuard;
//     });

//     const worksheet = xlsx.utils.json_to_sheet(modifiedGuards, { header: columnKeys });
//     const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
//     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
//     this.saveAsExcelFile(excelBuffer, 'Resguardos');
//   });
// }





// saveAsExcelFile(buffer: any, fileName: string): void {
//   let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//   let EXCEL_EXTENSION = '.xlsx';
//   const data: Blob = new Blob([buffer], {
//       type: EXCEL_TYPE
//   });
//   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
// }

// exportExcel() {
//   import('xlsx').then((xlsxModule) => {
//       const xlsx = xlsxModule.default; // Acceder al módulo xlsx
//       const worksheet = xlsx.utils.json_to_sheet(this.guards);
//       const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
//       const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
//       this.saveAsExcelFile(excelBuffer, 'products');
//   });
// }

// calculateCustomerTotal(number: number) {
//   let total = 0;

//   if (this.guardSave) {
//       for (let guard of this.guardSave) {
//           if (guard.payroll === number) {
//               total++;
//           }
//       }
//   }

//   return total;
// }
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
          title: `se han insertado`,
        });     
       },
      error:(e:any)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'error',
          title: `No se han podido insertar`,
        }); 
        this.visible = false
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
          this.visible = false
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

  // onSubmitUpdate(){
  //   this.loading = true;

  //   const formData = this.myFormUpdate.value;
  //   const form = new FormData();
  //   for (const key of Object.keys(formData)) {
  //     if (key.includes('picture')) {
  //       const files = formData[key];
    
  //       // Verifica si hay archivos antes de agregarlos al formulario
  //       if (files && files.length > 0) {
  //         const file = files[0];
  //         const newKey = `${key}`;
  //         form.append(newKey, file);
  //       }
  //     } else {
  //       form.append(key, formData[key]);
  //     }
  //   }
    
  //   this.service.Post('guards/update',form).subscribe({
  //     next:(n:any)=>{
  //       this.Toast.fire({
  //         position: 'top-end',
  //         icon: 'success',
  //         title: `se han actualizado`,
  //       });  
  //     },
  //     error:(e:any)=>{
  //       this.Toast.fire({
  //         position: 'top-end',
  //         icon: 'error',
  //         title: `no se ha podido actualizar`,
  //       });  
  //     },
  //     complete:()=>{
  //       this.visible= false
  //       this.guards =[]
  //       this.loading = false;
  //       this.getGuards()

  //     }
  //   })
    

  // }
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
      },
      complete:()=>{
        this.loading = false
        this.getGuards()
      }
    })
  }
//  EditGuard(guard:any){
//   if (this.myFormUpdate.get('picture')) {
//     this.myFormUpdate.removeControl(`picture`)

//   }
//   this.myFormUpdate.addControl(`picture`,new FormControl(''))
//   this.visible = true
//   this.action = 'edit'
//   this.myFormUpdate.get(`id`)?.setValue(guard.id)
//   this.myFormUpdate.get(`description`)?.setValue(guard.description)
//   this.myFormUpdate.get(`brand`)?.setValue(guard.brand)
//   this.myFormUpdate.get(`type`)?.setValue(guard.type)
//   this.myFormUpdate.get(`serial`)?.setValue(guard.serial)
//   this.myFormUpdate.get(`state`)?.setValue(guard.state)
//   this.myFormUpdate.get(`airlne`)?.setValue(guard.airlne)
//   this.myFormUpdate.get(`payroll`)?.setValue(guard.payroll)
//   this.myFormUpdate.get(`group`)?.setValue(guard.group)
//   this.myFormUpdate.get(`employeed`)?.setValue(guard.employeed)
//   this.myFormUpdate.get(`date`)?.setValue(guard.date)
//   this.myFormUpdate.get(`observations`)?.setValue(guard.observations)
//   this.myFormUpdate.addControl(`description`,new FormControl('',Validators.required))

// }
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
          if (guard[g] == undefined || guard[g] == null) {
            pass = false
            this.Toast.fire({
              icon: "warning",
              title: "No se puede activar debido a que no contiene su información necesaria"
            });
          }
          if (index == Object.keys(guard).length -1  && pass) {
            this.service.Delete(`guardsdestroy/${guard.id}`).subscribe({
              next:()=>{
                this.getGuards()
              },
              error:()=>{
                this.getGuards()
        
              }
           })
          }
      });
      
  


  }
}
    
  
  
  