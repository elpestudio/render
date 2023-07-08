import { Component } from '@angular/core';
import { TipoPersonaService } from 'src/app/Services/tipo-persona.service';
declare var window: any;

@Component({
  selector: 'app-tipo-persona',
  templateUrl: './tipo-persona.component.html',
  styleUrls: ['./tipo-persona.component.scss']
})
export class TipoPersonaComponent {

  formModal: any;

  tipoPersonas: any;

  //Path Api
  pathApi: String;

  // Table Tr Selected
  trClass = '';

  // Modal
  toogleModal: boolean;

  // Accion Formulario
  actionButton: String;
  actionForm: String;

  titleModal: String;

  // toast 
  message: String;
  toogleToast: boolean;
  toastCss = 'alert alert-dismissible alert-success';

  // Datos de Formulario
  id = 0;
  tipoFm = '';
  estadoFm = 'Activo';


  constructor(private appServices: TipoPersonaService){
    this.addSpinner();
    this.getAllLista();
    this.toogleModal = false;
    this.actionButton = 'Guardar';
    this.actionForm = 'POST';
    this.pathApi = 'Tipo Persona'
    this.titleModal = 'Nuevo '+ this.pathApi;

    this.message = '';
    this.toogleToast = false;
  }

  ngOnInt(): void{
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("modalForm")
    );


  }

  getAllLista(){
    this.appServices.getTipoPersona().subscribe((data:any) => {
      this.tipoPersonas = data.content;
      this.removeSpinner();
    })
  }

  mostrarModal(){
    this.resetForm();
    this.resetFilaSeleccionada();
    this.actionButton = 'Guardar';
    this.actionForm = 'POST';
    this.pathApi = 'Tipo Persona'
    this.titleModal = 'Nuevo '+ this.pathApi;
    this.toogleModal = true;
  }

  closeModal(){
    this.resetForm();
    this.resetFilaSeleccionada();
    this.toogleModal = false;
  }

  resetForm(){
    this.id = 0;
    this.tipoFm = '';
    this.estadoFm = 'Activo';
  }

  sendForm(){
    this.addSpinner();
    const dataForm = {
        id: this.id,
        tipo: this.tipoFm,
        estado: this.estadoFm,
    }

    if(this.id <= 0 && this.actionForm === 'POST'){
      this.appServices.setTipoPersona(dataForm).subscribe(data => {        
        this.closeModal();
        this.getAllLista();
        this.resetForm();
        this.toast('Registro satisfactorio.', 1800);
        this.removeSpinner();
      }, err => {
        const errores = err.error.errors;
        this.message = '';
        Array.from(errores).forEach(item => {
          const errs: any = item;
          this.message += errs.defaultMessage + ' / ';
          this.toastCss = 'alert alert-dismissible alert-danger';
          this.toast(this.message, 1800);
        })
        this.toogleToast = true;
        this.toogleModal = false;
        this.removeSpinner();
      })
    }

    if(this.id > 0 && this.actionForm === 'PUT'){
      this.appServices.updateTipoPersona(dataForm).subscribe(data => {
        this.closeModal();
        this.getAllLista();
        this.resetForm();
        this.resetFilaSeleccionada();
        this.toast('Actualizacion satisfactorio.', 1800);
        this.removeSpinner();
      })
    }
    

  }

  async editItem(event: Event, tipoPersona:any){   
    this.addSpinner();
    const parent = ( <HTMLElement>event.target ).parentElement;
    if(parent?.classList.contains('selected-tr')){
      await this.resetFilaSeleccionada();
      this.resetForm();
      this.removeSpinner();
    }else{
      await this.resetFilaSeleccionada();
      parent?.classList.add('selected-tr');

      this.id = tipoPersona.id;
      this.tipoFm = tipoPersona.tipo;
      this.estadoFm = tipoPersona.estado;

      this.actionButton = 'Actualizar';
      this.actionForm = 'PUT';
      this.pathApi = 'Tipo Persona'
      this.titleModal = 'Editar '+ this.pathApi;
      this.removeSpinner();
    }       

  }

  editModal(){
    this.addSpinner();
    if(this.id > 0){
      this.removeSpinner();
      this.toogleModal = true;
    }else{
      this.id = 0;
      this.toastCss = 'alert alert-dismissible alert-danger';
      this.toast('No Existe registro seleccionado, para editar.', 1800);
      this.removeSpinner();
    }
  }

  deleteitem(){
    this.addSpinner();
    if(this.id > 0){
      this.appServices.deleteTipoPersona(this.id).subscribe(data => {
        this.getAllLista();
        this.resetForm();
        this.resetFilaSeleccionada();
        this.toast('Registro Eliminado Satisfactoriamente.', 1800);
        this.removeSpinner();
      })
    }else{
      this.id = 0;
      this.toastCss = 'alert alert-dismissible alert-danger';
      this.toast('No Existe registro seleccionado, para eliminar.', 1800);
      this.removeSpinner();
    }
  }

  toast(message: String, time: any){
    this.message = message;
      this.toogleToast = true;
      setTimeout(() => {
        this.toogleToast = false;
      }, time);
  }

  async resetFilaSeleccionada(){
    const table = document.getElementById('table');
    const filas = (<HTMLElement>table).children[1].children;
    Array.from(filas).map(fila => {
      fila.classList.remove('selected-tr');
    })
  }

  addSpinner(){
    const spinner = document.getElementById('spinner');
    spinner?.classList.add('show');
  }

  removeSpinner(){
    const spinner = document.getElementById('spinner');
    spinner?.classList.remove('show');
  }

}
