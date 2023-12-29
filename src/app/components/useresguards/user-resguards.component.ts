import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { ServiceService } from 'src/app/service.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
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
  exportColumns!: ExportColumn[];
  roleTypeUser:any = localStorage.getItem('role')

  userId: string|null;
  name!:string
  group!:string
  payroll!:string
visible: boolean = false;
options: Option[] = [

];
cols!: Column[];
data:any
filteredOptions: Option[] = []; // Opciones filtradas para mostrar en el dropdown
searchText = ''; // Texto de búsqueda ingresado por el usuario
showDropdown = false; // Variable para controlar la visibilidad del dropdow
selected? : number| null
loading: boolean|undefined;
  constructor(private route: ActivatedRoute,private service:ServiceService<any>){
    this.userId = this.route.snapshot.paramMap.get('id');
    this.roleTypeUser = parseInt(this.roleTypeUser)
      this.cols = [
      { field: 'stock_number', header: 'NUMERO DE INVENTARIO', customExportHeader: 'NUMERO DE INVENTARIO' },
      { field: 'description', header: 'NOMBRE O DESCRIPCIÓN	', customExportHeader: 'NOMBRE O DESCRIPCIÓN' },
      { field: 'brand', header: 'MARCA Y MODELO', customExportHeader: 'Descripción del producto' },
      { field: 'type', header: 'TIPO', customExportHeader: 'Cantidad o Pieza' },
      { field: 'state', header: 'ESTADO FISICO', customExportHeader: 'Valor' },
      { field: 'airlane', header: 'ÁEREA DE ADSCRIPCION', customExportHeader: 'Departamento' },
      { field: 'group', header: 'UBICACIÓN/DEPARTAMENTO', customExportHeader: 'Numero de etiqueta' },
      { field: 'dateup', header: 'FECHA DE ASIGNACIÓN DEL RESGUARDO', customExportHeader: 'Numero de nomina' },
      { field: 'datedown', header: 'FECHA DE BAJA DEL RESGUARDO	', customExportHeader: 'Numero de nomina' },

  ];

  this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }
  showDialog(){
    this.selected = null
    this.searchText = ''
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
      this.guards()
    });
  }
  guards(){
    this.service.Data<Option>('guards/showOptions').subscribe({
      next:(n:any)=>{
        this.options = n['data']['result']
      },
      error:(e)=>{

      }
    })

  }
  ngOnDestroy(): void {
    this.data = [];

  }
  onSearch(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredOptions = this.options.filter(option => option.text.toLowerCase().includes(searchText));
  }

  showAllOptions(): void {
    this.filteredOptions = this.options;
    this.showDropdown = true;
  }
  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  selectOption(option: Option): void {
    this.searchText = option.text;
    this.showDropdown = false;
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
        this.GetData()
        this.guards()
        this.visible = false
      },
      error:(n:any)=>{
        this.loading = false
        this.visible = false

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
  onInputChangeReports(event: any) {
    if (event && event.target) {
      // Ahora TypeScript sabe que event.target no es nulo
      const inputValue: string = event.target.value;
      this.table.filterGlobal(inputValue, 'contains');
    }
  }
  deleteResguard(guard:any){
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
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
              observation:motivoResult.value
            }
            this.service.Post(`usersguards/guardsdestroy/${guard.idguard}`,json).subscribe({
              next:(n:any)=>{
                this.loading = false
                  this.data =n['data']['result']
                  this.GetData()
                   this.guards()

              },
              error:(n:any)=>{
                this.loading = false

              }
            })
          }
        });
      }
    });






  }
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const columnKeys = this.exportColumns.map((column) => column.title);

      // Crear una copia de this.guards para no modificar el original directamente
      const modifiedGuards = this.data.map((guard: { [x: string]: any; }) => {
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
    FileSaver.saveAs(data,this.name + EXCEL_EXTENSION);
  }
}