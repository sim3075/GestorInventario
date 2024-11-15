import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import { Producto } from '../../../interfaces/interface';
import { FooterComponent } from "../../../layout/footer/footer.component";
import { HeaderComponent } from "../../../layout/header/header.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-formulario',
  standalone: true,
  imports: [FormsModule, CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './producto-formulario.component.html',
  styleUrl: './producto-formulario.component.css'
})
export class ProductoFormularioComponent {

  update: boolean = false;

  producto: Producto = {
    id_tienda: 0,
    nombre: "",
    descripcion: "",
    precio: 0,
    cantidad: 0,
    categoria: "",
    imagen: "",
  };
  imagenFile:File| undefined

  constructor(private supabaseService: SupabaseService, private route: ActivatedRoute) { }

  onSubmit(): void {
    
    if (this.producto.id_tienda <0 || this.producto.nombre == "" ||
      this.producto.descripcion == "" ||
      this.producto.precio == 0 ||
      this.producto.categoria == "" ||
      this.producto.imagen == "" || this.imagenFile == undefined){ throw Error("Debes rellenar todo los campos")}
      this.producto.imagen = `${this.producto.id_tienda}/${this.producto.nombre}/${this.producto.imagen}`
      
      if (this.update) {
        this.actualizarProducto(this.producto);
      } else {
        this.crearProducto(this.producto, this.imagenFile);
        
      }
  }

  async actualizarProducto(producto: Producto) {
    this.supabaseService.actualizarProducto(producto)
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Actualizado con éxito",
      showConfirmButton: false,
      timer: 1500
    });
  }

  async crearProducto(producto: Producto, imagen:File) {    
    await this.supabaseService.crearProducto(producto)
    this.supabaseService.saveImagen(imagen,producto.imagen)
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Creado con éxito",
      showConfirmButton: false,
      timer: 1500
    });
 
  }

  async getProducto(id: number):Promise<void> {
    const response = await this.supabaseService.getProductoById(id)
    if (response.data){
      this.producto = response.data[0]
    }
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        this.imagenFile = input.files[0];
        this.producto.imagen = input.files[0].name
    }
}

  async ngOnInit() {
    this.route.paramMap.subscribe(async params =>{
      const id = params.get('id');      
      
      this.producto.id_tienda = Number(params.get("idTienda"));      
      if (id) {
        await this.getProducto(Number(id))
        if (this.producto) {
          this.update = true;
        }
      }
    });
  }
}
