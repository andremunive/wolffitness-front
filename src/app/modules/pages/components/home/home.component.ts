import { Component, OnInit } from '@angular/core';
import { supabase } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  async ngOnInit() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        console.warn('No hay sesión activa');
        // this.router.navigate(['/login']);
        return;
      }

      const user = session.user;
      console.log('Sesión restaurada correctamente:', user);

      // Aquí puedes continuar con lógica de permisos, etc.
    });
  }

  // async getPermissions() {
  //   const { data: sessionData, error: sessionError } =
  //     await supabase.auth.getSession();

  //   if (!sessionData.session) {
  //     console.log('No hay sesión activa. Redirigir a login o manejar esto.');
  //     return;
  //   }

  //   const { data, error } = await supabase.auth.getUser();
  //   const email = data.user?.email;

  //   const { data: user, error: userError } = await supabase
  //     .from('user')
  //     .select('*')
  //     .eq('email', email)
  //     .single();
  // }
}
