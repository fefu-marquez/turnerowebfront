import { Component, OnInit } from '@angular/core';
import { TurnoService, Turno } from 'src/app/services/turno.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Categoria, CategoriaService } from 'src/app/services/categoria.service';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-nuevoturno',
  templateUrl: './nuevoturno.component.html',
  styleUrls: ['./nuevoturno.component.css']
})
export class NuevoturnoComponent implements OnInit {
  txtNombreApellido : string;
  txtFecha : string;
  txtCategoria : number;
  txtHora : string;
  txtMinutos : string;
  txtOrden : number;
  yaEnvioFormulario : boolean;
  turnoCreado : any;
  categorias : Categoria[] = [];

  constructor(private servicioTurno : TurnoService, private servicioCategoria : CategoriaService, private formatFecha : DatePipe, private router : Router) { 
    this.yaEnvioFormulario = false;
  }

  ngOnInit(): void {
    this.turnoCreado = {
      id : null,
      orden : null,
      fecha : null,
      hora : null,
      nombreApellido : null,
      categoria : {
        id : null,
        nombre : null,
        descripcion : null
      }
    };

    this.servicioCategoria.get().subscribe(respuesta => {
      this.categorias = respuesta;
    });
  }

  crearTurno() {
    if (this.controlarCampos()) {
      let categoriaSeleccionada : Categoria;

      categoriaSeleccionada = this.categorias.filter(c => c.id == this.txtCategoria)[0];
      
      let nuevoTurno : Turno = {
        id : null,
        orden : this.txtOrden,
        fecha : this.formatFecha.transform(this.txtFecha, "dd-MM-yyyy"),
        hora : `${this.txtHora}:${this.txtMinutos}:00`,
        nombreApellido : this.txtNombreApellido,
        categoria : categoriaSeleccionada
      };
      
      this.servicioTurno.guardarTurno(nuevoTurno).subscribe(respuesta => {
        this.yaEnvioFormulario = true;
        this.turnoCreado = respuesta;
      });
    }
    else{
      alert("Por favor llenar todos los campos.");
    }
  }

  controlarCampos() : boolean {
    let noHayErrores : boolean = true;

    if (this.txtOrden == undefined) {
      noHayErrores = false;
    } 
    
    if (this.txtFecha == undefined) {
      noHayErrores = false;
    }

    if (this.txtHora == undefined || this.txtMinutos == undefined)  {
      noHayErrores = false;
    }

    if (this.txtNombreApellido == undefined) {
      noHayErrores = false;
    } else if (this.txtNombreApellido == "" || this.txtNombreApellido == " ") {
      noHayErrores = false;
    }

    if (this.txtCategoria == undefined) {
      noHayErrores = false;
    }

    return noHayErrores;
  }

  limpiarFiltros() {
    this.txtNombreApellido = undefined;
    this.txtFecha = undefined;
    this.txtCategoria = undefined;
    this.txtHora = undefined;
    this.txtMinutos = undefined;
    this.txtOrden = undefined;
  }
  
  modificarTurno(t : Turno){
    this.servicioTurno.getTurno(t.id).subscribe(respuesta => {
      this.router.navigate(['/modificarturno', respuesta.id]);
    });
  }

  borrarTurno(t : Turno) {
    this.servicioTurno.getTurno(t.id).subscribe(respuesta => {
      console.log(respuesta.id);
      this.servicioTurno.borrarTurno(respuesta.id).subscribe(respuesta => {
        console.log("Toy joya");
      });
    });
  }
}
