import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-frontend';
  entries:Entry[] =[];
  isSearch=false;
  isEdit = false;
  editId='';

  todoForm = this.formBuilder.group({
    entry: '',
    dueDate: '',
    priority:''
  });
  priorityFilter = this.formBuilder.group({
    priority:''
  });

  constructor(private http: HttpClient,
    private formBuilder: FormBuilder) {
    this.getAll();
  }
  getAll(){
    this.http.get<Entry[]>('http://localhost:8080/getAll')
      .subscribe(data => {
        console.log(data);
        this.entries=data;
        this.todoForm.reset();
      },
      error=>{
        console.log(error);
      });
  }
  delete(id:number){
    this.http.delete('http://localhost:8080/delete/' + id)
      .subscribe(data => {
        console.log(data);
        this.getAll();
      },
      error=>{
        console.log(error);
      });
  }

  onSubmit(): void {
    if(this.isEdit){
      this.http.post('http://localhost:8080/update/'+this.editId,this.todoForm.value)
        .subscribe(data => {
          console.log(data);
          this.getAll();
          this.isEdit=false;
        },
        error=>{
          console.log(error);
          this.isEdit=false;
        });
    } else {
      this.http.post('http://localhost:8080/add',this.todoForm.value)
        .subscribe(data => {
          console.log(data);
          this.getAll();
        },
        error=>{
          console.log(error);
        });
    }
  }

  filter(): void{
    this.http.get<Entry[]>('http://localhost:8080/getAll')
      .subscribe(data => {
        console.log(data);
        if(this.priorityFilter.value.priority?.length){
          this.entries=data.filter(entry=> entry.priority==this.priorityFilter.value.priority);
        } else{
          this.entries=data;
        }
      },
      error=>{
        console.log(error);
      });
  }
  edit(entry:Entry){
    this.isEdit=true;
    this.editId=entry.id;
    this.todoForm.get("entry")?.patchValue(entry.entry);
    this.todoForm.get("dueDate")?.patchValue(entry.dueDate);
    this.todoForm.get("priority")?.patchValue(entry.priority);
  }

}

interface Response {
  value: string
}
interface Entry {
  id: string,
  entry: string,
  priority: string,
  dueDate: string
}

