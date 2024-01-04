import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent {





  searchAirl!:Boolean
  groupSelected:any
  visibleGroup!: boolean;
  visibleAirlane!: boolean;
  myFormGroup!: FormGroup
  myFormAirlane!: FormGroup
  actionGroup!:Boolean
  actionAirlane!:Boolean
  dataGroup:any
  dataAirlane:any
  dataFiltersGroup:any
  dataFiltersAirlane:any
  dataNewAirlane:any = []
  constructor(private service:ServiceService<any>){
    this.allGroups()
    this.allAirlane()
    this.myFormGroup = new FormGroup({
      id: new FormControl(''),
      name:new FormControl('',Validators.required),
      
    });
    this.myFormAirlane = new FormGroup({
      id: new FormControl(''),
      name:new FormControl('',Validators.required),
      
    });
  }
  addGroup() {
    this.actionGroup = true
    this.myFormGroup.reset()
    this.visibleGroup = true
  }
  addAirlane() {
    this.myFormAirlane.reset()
    this.visibleAirlane = true
  }
  onSubmitAirlane() {
    this.visibleAirlane = false
    this.service.Post('airlanes',this.myFormAirlane.value).subscribe({
      next:(n)=>{
        console.log('insertado')
        this.allAirlane()
      },
      error:(e)=>{
        
      }
    })  }
    onSubmitGroup() {
      let url = 'groups'
      if (!this.actionGroup) {
            url = 'groups/update'
      }
      this.visibleGroup = false

    this.service.Post(url,this.myFormGroup.value).subscribe({
      next:(n)=>{
        this.allGroups()
      },
      error:(e)=>{

      }
    })
  }
  allGroups(){
    this.service.Data<any>('groups').subscribe({
      next:(n)=>{
        this.dataGroup = n['data']['result']
        this.dataGroup = this.dataGroup.map(obj => ({ ...obj, checked: 0 }));
        this.dataFiltersGroup = this.dataGroup

        if ( this.dataNewAirlane && this.dataNewAirlane.length > 0) {
          this.dataGroup.forEach((group, index) => {
            const found = this.dataNewAirlane.some(item => item.id === group.id);
            if (found) {
              this.dataGroup[index].checked = 1;
              this.dataFiltersGroup[index].checked = 1;
            }
          });

        }

      }
    })
  }
  allAirlane(){
    this.service.Data<any>('airlanes').subscribe({
      next:(n)=>{
        this.dataAirlane = n['data']['result']
        this.dataFiltersAirlane = this.dataAirlane
      }
    })
  }
  itemGroupSelected(name: any) {
    this.groupSelected = name
    }
    addItemGroupInAirlane(group: any) {
      let repeatData = [];
      
      if (!this.dataNewAirlane) {
        this.dataNewAirlane = []; 
      }
    
      if (this.dataNewAirlane) {
        repeatData = this.dataNewAirlane.filter((item) => item.id === group.id);
      }
    
      if ( repeatData.length > 0) {
        this.dataNewAirlane = this.dataNewAirlane.filter((item) => item.id != group.id);
        this.dataGroup.forEach(element => {
          if (element.id ==group.id) {
              element.checked = 0
          }
      });
      }
      else{
        
        this.dataNewAirlane.push(group);
        this.dataGroup.forEach(element => {
            if (element.id ==group.id) {
                element.checked = 1
            }
        });
      }
    
    }
    searchGroup(event:any) {
        if (event.target.value.length > 1) {
          this.dataFiltersGroup = this.dataFiltersGroup.filter(u => typeof u.name === 'string' && u.name.toString().toLowerCase().includes(event.target.value.toLowerCase())
          );
        }
        else{
   
          this.dataFiltersGroup =  this.dataGroup

          
          
          
        }
    
        
    }
    searchAirlane(event:any) {
      if (event.target.value.length > 1) {
        this.dataFiltersAirlane = this.dataFiltersAirlane.filter(u => typeof u.name === 'string' && u.name.toString().toLowerCase().includes(event.target.value.toLowerCase())
        );
      }
      else{
        this.dataFiltersAirlane =  this.dataAirlane
      }
    }
    activeSearchAirlane() {
      this.searchAirl = !this.searchAirl; 
      
    }
    destroyGroup(id: number) {
      const repeatData = this.dataNewAirlane.filter((item) => item.id === id);
      if (repeatData.length>0) {
          
        return
      }
      this.service.Delete(`groups/destroy/${id}`).subscribe({
        next:(n)=>{
            this.allGroups()
        }
      })
    }
    updateGroupSelected(group: any) {
      this.actionGroup = false
      const repeatData = this.dataNewAirlane.filter((item) => item.id === group.id);
      if (repeatData.length>0) {
          
        return
      }
      Object.keys(group).forEach((item)=>{
                this.myFormGroup.get(item)?.setValue(`${group[item]}`)
        })
        this.visibleGroup = true
    }
    clear() {
      this.groupSelected = null
      this.dataNewAirlane = []
      this.dataGroup.forEach(obj => {
        obj.checked = 0;
      });
         
    }
    updateAirlaneSelected(airlane: any) {
      Object.keys(airlane).forEach((item)=>{
        this.myFormAirlane.get(item)?.setValue(`${airlane[item]}`)
      })
      this.visibleAirlane = true    
    }
    destroyAirlane(id){
      console.log("jere")
      this.service.Delete(`airlanes/destroy/${id}`).subscribe({
        next:(n)=>{
            this.allAirlane()
        }
      })
    }
  }
