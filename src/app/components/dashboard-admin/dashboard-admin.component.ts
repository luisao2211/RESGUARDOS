import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ServiceService } from 'src/app/service.service';
import * as FileSaver from 'file-saver';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

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
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent {
  cols!: Column[];

  exportColumns!: ExportColumn[];
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  @ViewChild('dt1') table!: Table; 
  @ViewChild('dt') tableReports!: Table; 

  loading: boolean = true;
  guardSave:any =[]
  
  users :any
  id!:number
  action!:boolean
  visible: boolean = false;
  myForm!: FormGroup;
  constructor(private Http:ServiceService<any>){
    this.LoadUsers()
    this.getGuards()
    this.cols = [
      { field: 'facture', header: 'Factura', customExportHeader: 'Factura' },
      { field: 'emisor', header: 'Emisor', customExportHeader: 'Emisor' },
      { field: 'description', header: 'Descripción del producto', customExportHeader: 'Descripción del producto' },
      { field: 'type', header: 'Cantidad o Pieza', customExportHeader: 'Cantidad o Pieza' },
      { field: 'value', header: 'Valor', customExportHeader: 'Valor' },
      { field: 'name', header: 'Nombre del resguardante', customExportHeader: 'Nombre del resguardante' },
      { field: 'group', header: 'Departamento', customExportHeader: 'Departamento' },
      { field: 'numberconsecutive', header: 'Numero consecutivo', customExportHeader: 'Numero consecutivo' },
      { field: 'label', header: 'Numero de etiqueta', customExportHeader: 'Numero de etiqueta' },
      { field: 'payroll', header: 'Numero de nomina', customExportHeader: 'Numero de nomina' },
      { field: 'email', header: 'responsable', customExportHeader: 'responsable' },
      { field: 'status', header: 'status', customExportHeader: 'status' },

  ];
  this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

    this.myForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required,Validators.email]),
        password: new FormControl('123456'),
        role: new FormControl('1')
      }
      )
    }
    OnInit(){
    
    }
    onInputChange(event: any) {
      if (event && event.target) {
        // Ahora TypeScript sabe que event.target no es nulo
        const inputValue: string = event.target.value;
        this.table.filterGlobal(inputValue, 'contains');
      }
    }
    onInputChangeReports(event: any) {
      if (event && event.target) {
        // Ahora TypeScript sabe que event.target no es nulo
        const inputValue: string = event.target.value;
        this.tableReports.filterGlobal(inputValue, 'contains');
      }
    }
    showDialog() {
      this.visible = true;
    }
    getGuards(){
      this.loading = true;
  
      this.Http.Data<any>("guards/admin").subscribe({
        next:(n)=>{
          this.guardSave =n['data']["result"]
         
        },
        error:(e)=>{
    
        },
        complete:()=>{
          
          this.loading = false;
    
        }
      })
    } 
  onSubmit() {
    let url = 'auth/register'
    if (this.action) {
      url = `users/${this.id}` 
    }
   this.Http.Post(url,this.myForm.value).subscribe({
    next:(n)=>{
      this.Toast.fire({
        position: 'top-end',
        icon: 'success',
        title: `se a completado la accion`,
      });
      this.LoadUsers()
    },
    error:(e)=>{
      this.Toast.fire({
        position: 'top-end',
        icon: 'error',
        title: `No se pudo hacer la accion`,
      });
    },
    complete:()=>{
      this.myForm.reset()

      this.action = false
      this.id = 0
      this.visible = false
      this.myForm.get("email")?.setValue('')
    }
   }) 
  }
  updateStatus(id:any){
    this.Http.Delete(`users/${id}`).subscribe({
      next:(n)=>{
        this.LoadUsers()
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `Se cambio el permiso del usuario.`,
        });
      },
      error:(e)=>{
        this.Toast.fire({
          position: 'top-end',
          icon: 'success',
          title: `no se pudo cambiar el permiso del usuario.`,
        });
      }
    })
  }
  updateEmail(email:String,id:number){
    this.action = true
    this.id = id
    this.visible = true;
    this.myForm.get("email")?.setValue(email)
  }
 LoadUsers(){
  this.loading = true;

  this.Http.Data<any>("users").subscribe({
    next:(n)=>{
      this.users =n['data']["result"]
    },
    error:(e)=>{

    },
    complete:()=>{
      this.loading = false;

    }
  })
 }
 exportPdf() {

  import('jspdf').then((jsPDFModule) => {
    import('jspdf-autotable').then((autoTableModule) => {
      const jsPDF = jsPDFModule.default;
      const autoTable = autoTableModule.default;

      const doc = new jsPDF('p', 'px', 'a4');
      (doc as any).autoTable({
        columns: this.exportColumns,
        body: this.guardSave
      });
      doc.save('Resguardos.pdf');
    });
  });
}
exportExcel() {
  import('xlsx').then((xlsx) => {
    const columnKeys = this.exportColumns.map((column) => column.title);

    // Crear una copia de this.guards para no modificar el original directamente
    const modifiedGuards = this.guardSave.map((guard: { [x: string]: any; }) => {
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
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}

}
