import { Component } from '@angular/core';
import { InstitucionService } from 'src/app/Services/institucion.service';
import { PersonaService } from 'src/app/Services/persona.service';
import { TipoPersonaService } from 'src/app/Services/tipo-persona.service';
declare var window: any;

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent {

  formModal: any;

  personas: any;
  tipoPersonas: any;
  instituciones: any;

  //Path Api
  pathApi: String;

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
  tipoPersonaFm = "0";
  nombresApellidosFm = '';
  correoFm = '';
  matriculaFm = '';
  usuarioFm = '';
  institucionFm = "0";
  estadoFm = 'Activo';


  constructor(private appServices: PersonaService, private appServiceInstitucion: InstitucionService, private appServiceTipoPersona: TipoPersonaService){
    this.addSpinner();
    this.getListaPersonas();
    this.toogleModal = false;
    this.actionButton = 'Guardar';
    this.actionForm = 'POST';
    this.pathApi = 'Persona'
    this.titleModal = 'Nueva '+ this.pathApi;

    this.message = '';
    this.toogleToast = false;
  }

  ngOnInt(): void{
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("modalForm")
    );


  }

  getListaPersonas(){
    this.appServices.getPersonas().subscribe((data:any) => {
      this.personas = data.content;
      this.removeSpinner();
    })

    this.appServiceInstitucion.getInstituciones().subscribe((data:any) => {
      this.instituciones = data.content;
    })

    this.appServiceTipoPersona.getTipoPersona().subscribe((data:any) => {
      this.tipoPersonas= data.content;
    })
  }

  mostrarModal(){
    this.resetForm();
    this.resetFilaSeleccionada();
    this.actionButton = 'Guardar';
    this.actionForm = 'POST';
    this.pathApi = 'Persona'
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
    this.tipoPersonaFm = '0';
    this.nombresApellidosFm = '';
    this.correoFm = '';
    this.matriculaFm = '';
    this.usuarioFm = ''
    this.estadoFm = 'Activo';
    this.institucionFm = '0';
  }

  sendForm(){
    this.addSpinner();
    const dataForm = {
        id: this.id,
        tipopersona_id: {id: this.tipoPersonaFm},
        nombresApellidos: this.nombresApellidosFm,
        correo: this.correoFm,
        matricula: this.matriculaFm,
        usuario: this.usuarioFm,
        password: 'admin',
        estado: this.estadoFm,
        institucion_id: {id: this.institucionFm},
    }

    if(this.id <= 0 && this.actionForm === 'POST'){
      this.appServices.setPersona(dataForm).subscribe(data => {
        this.closeModal();
        this.getListaPersonas();
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
      this.appServices.updatePersona(dataForm).subscribe(data => {
        this.closeModal();
        this.getListaPersonas();
        this.resetForm();
        this.resetFilaSeleccionada();
        this.toast('Actualizacion satisfactorio.', 1800);
        this.removeSpinner();
      })
    }
    

  }

  async editItem(event: Event, persona:any){
    this.addSpinner();
    const parent = ( <HTMLElement>event.target ).parentElement;
    if(parent?.classList.contains('selected-tr')){
      await this.resetFilaSeleccionada();
      this.resetForm();
      this.removeSpinner();
    }else{
      await this.resetFilaSeleccionada();
      parent?.classList.add('selected-tr');

      this.id = persona.id;
      this.tipoPersonaFm = persona.tipopersona_id.id;
      this.nombresApellidosFm = persona.nombresApellidos;
      this.correoFm = persona.correo;
      this.matriculaFm = persona.matricula;
      this.usuarioFm = persona.usuario;
      this.estadoFm = persona.estado;
      this.institucionFm = persona.institucion_id.id;

      this.actionButton = 'Actualizar';
      this.actionForm = 'PUT';
      this.pathApi = 'Persona'
      this.titleModal = 'Editar '+ this.pathApi;
      this.removeSpinner();
    }    

  }

  editModal(){
    this.addSpinner();
    if(this.id > 0){
      this.toogleModal = true;
      this.removeSpinner();
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
      this.appServices.deletePersona(this.id).subscribe(data => {
        this.getListaPersonas();
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
