import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../../interfaces/interface';
import { SupabaseService } from '../../../services/supabase.service';
import { HeaderComponent } from "../../../layout/header/header.component";
import { FooterComponent } from "../../../layout/footer/footer.component";

@Component({
  selector: 'app-display-producto',
  standalone: true,
  templateUrl: './display-producto.component.html',
  styleUrl: './display-producto.component.css',
  imports: [HeaderComponent, FooterComponent]
})
export class DisplayProductoComponent implements OnInit {

  producto: Producto | null = null

  constructor(private supabaseService: SupabaseService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const response = await this.supabaseService.getProductoById(Number(params.get("id")));
      if (response.data) {
        this.producto = response.data[0]
        if (this.producto) {
          const buckerResponse = await this.supabaseService.getImagen(this.producto!.imagen)
          this.producto.imagen = buckerResponse.data.publicUrl
        }
      }
    })

  }

}
