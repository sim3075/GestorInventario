import { Component, OnInit } from '@angular/core';
import { Producto } from '../../interfaces/interface';
import { SupabaseService } from '../../services/supabase.service';
import { SearchProductoComponent } from "../producto/search-producto/search-producto.component";
import { Router } from '@angular/router';
import { HeaderComponent } from "../../layout/header/header.component";
import { FooterComponent } from "../../layout/footer/footer.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [SearchProductoComponent, HeaderComponent, FooterComponent]
})
export class HomeComponent implements OnInit {

  productos: Producto[] = []

  constructor(private supabaseService: SupabaseService, private router: Router) { }

  async ngOnInit() {
    const response = await this.supabaseService.getProducto({ nombre: "", categoria: "", maxPrecio: Number.MAX_SAFE_INTEGER, minPrecio: 0 }, 10)
    if (response.data) {
      this.productos = response.data
      await Promise.all(
        this.productos.map(async (producto) => {
          const { data } = await this.supabaseService.getImagen(producto.imagen);
          producto.imagen = data?.publicUrl || ''
        })
      );
    }
  }

  //En caso de que se haga una busqueda, se ejecuta esta función
  receiveProductos($event: Producto[]) {
    this.productos = $event
  }

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

  async eliminarProducto(id: number) {
    Swal.fire({
      title: "Eliminar",
      position: "center",
      text: "¿Está seguro de eliminar el producto seleccionado?",
      icon: "warning",
      iconColor: "#219ebc",
      showCancelButton: true,
      confirmButtonColor: "#023047",
      cancelButtonColor: "#d00000",
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await this.supabaseService.eliminarProducto(id)
          window.location.reload()

        }
      });
    await this.supabaseService.eliminarProducto(id)
    window.location.reload()
  }


  actualizarProducto(id: number, idTienda: number) {
    this.router.navigate(['tiendas', idTienda, 'producto', id]);
    
  }

}
