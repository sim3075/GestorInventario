import { Component } from '@angular/core';
import { SupabaseService } from '../../../services/supabase.service';
import { Rol, Usuario } from '../../../interfaces/interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  usuario: Usuario ={
    email :"",
    nombre:"",
    password: "",
    rol:Rol.cliente

  }

  
  constructor(private supabaseService:SupabaseService, private router: Router){}

  async onSubmit(){
    //console.log("creando usuario");
    const auth = await this.supabaseService.signUpNewUser(this.usuario.email,this.usuario.password)
    
    if (auth.error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: auth.error,
        showConfirmButton: false,
        timer: 1500
      });
    }else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Usuario creado con éxito",
        showConfirmButton: false,
        timer: 1500
      });
    }

    this.router.navigate(['home']);
  }
}
