import { Component } from '@angular/core';
import { InstitucionService } from 'src/app/Services/institucion.service';
declare var window: any;

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: ['./institucion.component.scss']
})
export class InstitucionComponent {
  formModal: any;

  instituciones: any;

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
  rucFm = '';
  nombreFm = '';
  direccionFm = '';
  correoFm = '';
  celularFm = '';
  estadoFm = 'Activo';


  constructor(private appServices: InstitucionService){
    this.addSpinner();
    this.getAllLista();
    this.toogleModal = false;
    this.actionButton = 'Guardar';
    this.actionForm = 'POST';
    this.pathApi = 'Institución'
    this.titleModal = 'Nueva '+ this.pathApi;

    this.message = '';
    this.toogleToast = false;
  }

  ngOnInt(): void{
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("modalForm")
    );


  }

  getAllLista(){
    this.appServices.getInstituciones().subscribe((data:any) => {
      this.instituciones = data.content;
      this.removeSpinner();
    })
  }

  mostrarModal(){
    this.resetForm();
    this.resetFilaSeleccionada();
    this.actionButton = 'Guardar';
    this.actionForm = 'POST';
    this.pathApi = 'Institución'
    this.titleModal = 'Nueva '+ this.pathApi;
    this.toogleModal = true;
  }

  closeModal(){
    this.resetForm();
    this.resetFilaSeleccionada();
    this.toogleModal = false;
  }

  resetForm(){
    this.id = 0;
    this.rucFm = '';
    this.nombreFm = '';
    this.direccionFm = '';
    this.correoFm = '';
    this.celularFm = '';
    this.estadoFm = 'Activo';
  }

  sendForm(){
    this.addSpinner();
    const dataForm = {
        id: this.id,
        ruc: this.rucFm,
        nombre: this.nombreFm,
        direccion: this.direccionFm,
        correo: this.correoFm,
        celular: this.celularFm,
        estado: this.estadoFm,
    }

    if(this.id <= 0 && this.actionForm === 'POST'){
      this.appServices.setInstitucion(dataForm).subscribe(data => {
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
      this.appServices.updateInstitucion(dataForm).subscribe(data => {
        this.closeModal();
        this.getAllLista();
        this.resetForm();
        this.resetFilaSeleccionada();
        this.toast('Actualizacion satisfactorio.', 1800);
        this.removeSpinner();
      })
    }
    

  }

  async editItem(event: Event, institucion:any){   
    this.addSpinner();
    const parent = ( <HTMLElement>event.target ).parentElement;
    if(parent?.classList.contains('selected-tr')){
      await this.resetFilaSeleccionada();
      this.resetForm();
      this.removeSpinner();
    }else{
      await this.resetFilaSeleccionada();
      parent?.classList.add('selected-tr');

      this.id = institucion.id;
      this.rucFm = institucion.ruc;
      this.nombreFm = institucion.nombre;
      this.direccionFm = institucion.direccion;
      this.correoFm = institucion.correo;
      this.celularFm = institucion.celular;
      this.estadoFm = institucion.estado;

      this.actionButton = 'Actualizar';
      this.actionForm = 'PUT';
      this.pathApi = 'Institución'
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
      this.appServices.deleteInstitucion(this.id).subscribe(data => {
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
