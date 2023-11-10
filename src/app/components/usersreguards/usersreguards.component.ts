import {AfterViewInit, Component, ViewChild, ChangeDetectorRef, NgZone, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { Table } from 'primeng/table'; 

import { log } from 'handsontable/helpers';




@Component({
  selector: 'app-usersreguards',
  templateUrl: './usersreguards.component.html',
  styleUrls: ['./usersreguards.component.css']
})
export class UsersreguardsComponent  {
  addTr: number = 0;
  inputsForm: any = [];
  myForm!: FormGroup;
  first = 0;
  @ViewChild('dt') table?: Table; 

  rows = 10;
  guards: any = [
   
  ]
  conteo: number = 0;

  value:any;
  clonedProducts: { [s: string]: any } = {};
  editing: any;
  
  constructor(private fb: FormBuilder) {

    
    this.myForm = new FormGroup({
      
    });
   this.moreInputs()
    
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
}

reset() {
    this.first = 0;
  }
  pageChange(event:any) {
    this.first = event.first;
    this.rows = event.rows;
  }
  
  isLastPage(): boolean {
    return this.guards ? this.first === this.guards.length - this.rows : true;
  }
  
  isFirstPage(): boolean {
    return this.guards ? this.first === 0 : true;
  }
  onRowEditInit(guards: any) {
    console.warn(this.myForm.controls)
    this.clonedProducts[guards.id as string] = { ...guards };
  }

filter(evento:any){
  console.log(this.value);
  console.log(evento);
}

onRowEditSave(index: number) {
  console.log(index)
    this.guards[index]["facture"] = this.myForm.get(`facture${index}`)?.value
    this.guards[index]["emisor"] = this.myForm.get(`emisor${index}`)?.value
    this.guards[index]["description"] = this.myForm.get(`description${index}`)?.value
    this.guards[index]["type"] = this.myForm.get(`type${index}`)?.value
    this.guards[index]["value"] = this.myForm.get(`value${index}`)?.value
    this.guards[index]["name"] = this.myForm.get(`name${index}`)?.value
    this.guards[index]["group"] = this.myForm.get(`group${index}`)?.value
    this.guards[index]["numberconsecutive"] = this.myForm.get(`numberconsecutive${index}`)?.value
    this.guards[index]["label"] = this.myForm.get(`label${index}`)?.value
    this.guards[index]["payroll"] = this.myForm.get(`payroll${index}`)?.value

   
    // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
 
    // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
  
}

onRowEditCancel(guards: any, index: number) {
  this.guards[index] = this.clonedProducts[guards.id as string];
  delete this.clonedProducts[guards.id as string];
}
onRowDelete(index:number){
  const id = this.guards[index].id
  this.guards.splice(index,1)
  this.myForm.removeControl(`img${id}`)
  this.myForm.removeControl(`picture${id}`)
  this.myForm.removeControl(`facture${id}`)
  this.myForm.removeControl(`emisor${id}`)
  this.myForm.removeControl(`description${id}`)
  this.myForm.removeControl(`type${id}`)
  this.myForm.removeControl(`value${id}`)
  this.myForm.removeControl(`name${id}`)
  this.myForm.removeControl(`group${id}`)
  this.myForm.removeControl(`numberconsecutive${id}`)
  this.myForm.removeControl(`label${id}`)
  this.myForm.removeControl(`payroll${id}`)
  this.table?.reset();


  
}
moreInputs() {
  console.warn(this.guards.length)

  this.addTr ++
    const inputs = {
      id:`${this.addTr}`,
      img:"",
      picture: "",
      facture:"",
      emisor: "",
      description: "",
      type: "",
      value: "",
      name: "",
      group: "",
      numberconsecutive: "",
      label: "",
      payroll: "",
      }
    
      this.guards.push(inputs)
      this.addFomControls()
      this.table?.reset();

  }
addFomControls(){
  this.myForm.addControl(`img${this.addTr}`,new FormControl(''))
  this.myForm.addControl(`picture${this.addTr}`,new FormControl('',Validators.required))
  this.myForm.addControl(`facture${this.addTr}`,new FormControl(''))
  this.myForm.addControl(`emisor${this.addTr}`,new FormControl(''))
  this.myForm.addControl(`description${this.addTr}`,new FormControl('',Validators.required))
  this.myForm.addControl(`type${this.addTr}`,new FormControl('',Validators.required))
  this.myForm.addControl(`value${this.addTr}`,new FormControl('',Validators.required))
  this.myForm.addControl(`name${this.addTr}`,new FormControl('',Validators.required))
  this.myForm.addControl(`group${this.addTr}`,new FormControl('',Validators.required))
  this.myForm.addControl(`numberconsecutive${this.addTr}`,new FormControl('',Validators.required))
  this.myForm.addControl(`label${this.addTr}`,new FormControl('',Validators.required))
  this.myForm.addControl(`payroll${this.addTr}`,new FormControl('',Validators.required))
}
onFileChange(event: any, index: number): void {
  console.log(index)
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const base64String = e.target.result.split(',')[1];
      this.myForm.get('img' + index)?.setValue(base64String);
    };

    reader.readAsDataURL(file);
  }
}



  onSubmit() {
    console.log(this.myForm.value)
    const formData = this.myForm.value;

    // Crea un objeto FormData
    const form = new FormData();

    // Agrega cada campo del formulario al objeto FormData
    for (const key of Object.keys(formData)) {
      form.append(key, formData[key]);
    }
   
  }
}
    // this.buildForm();
    
    
    // picture: "",
    // emisor: "",
    // description: "",
    // type: "",
    // value: "",
    // name: "",
    // group: "",
    // numberconsecutive: "",
    // label: "",
  // payroll: "",
  
  
  