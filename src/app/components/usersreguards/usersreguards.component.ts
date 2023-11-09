import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { log } from 'handsontable/helpers';




@Component({
  selector: 'app-usersreguards',
  templateUrl: './usersreguards.component.html',
  styleUrls: ['./usersreguards.component.css']
})
export class UsersreguardsComponent {
  addTr: number = 0;
  inputsForm: any = [];
  myForm!: FormGroup;
  first = 0;
  
  rows = 10;
  guards: any = [
   
  ]

  value:any;
  clonedProducts: { [s: string]: any } = {};
  editing: any;
  
  constructor(private fb: FormBuilder) {

    
    this.myForm = new FormGroup({
      
    });
    this.guards.push( {
      id: '0',
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
    })
    this.addFomControls()

    
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

onRowEditSave(guard: any) {
    this.guards.forEach((e: any) => {
      if (e.id ==guard.id) {
        console.log(e)
          e = guard
          console.error(e)
      }
    });
    delete this.clonedProducts[guard.id as string];
    // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
 
    // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
  
}

onRowEditCancel(guards: any, index: number) {
  this.guards[index] = this.clonedProducts[guards.id as string];
  delete this.clonedProducts[guards.id as string];
}
moreInputs() {
  this.addTr ++
    const inputs = {
      id:`${this.addTr +1}`,
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
    
    console.warn(this.inputsForm.length)
  }
addFomControls(){
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


  onSubmit() {
  console.log(this.myForm.controls)

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
  
  
  