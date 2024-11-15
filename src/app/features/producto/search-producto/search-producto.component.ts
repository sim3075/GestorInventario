import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { Producto, SearchProductoDto } from '../../../interfaces/interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-producto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-producto.component.html',
  styleUrl: './search-producto.component.css'
})
export class SearchProductoComponent {
  busqueda: SearchProductoDto = {
    nombre: "",
    categoria: "",
    maxPrecio: Number.MAX_SAFE_INTEGER,
    minPrecio: 0,

  }

  @Output() productoEvent = new EventEmitter<Producto[]>();

  constructor(private supabaseService: SupabaseService) {}

  onSubmit() {
    this.buscarProductos()
  }

  async buscarProductos() {
    const response = await this.supabaseService.getProducto(this.busqueda, 10)
    if (response.data) {
      this.productoEvent.emit(response.data)
    }
    Swal.fire({
      position: "center",
      icon: "info",
      title: "Buscando",
      showConfirmButton: false,
      timer: 1500
    });
    
  }

}
