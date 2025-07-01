import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';
import { from, Observable } from 'rxjs';
import { Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthV2Service {
  login(email: string, password: string): Observable<Session | null> {
    return from(
      supabase.auth.signInWithPassword({ email, password }).then((res) => {
        if (res.error) throw res.error;
        return res.data.session;
      })
    );
  }

  async logout() {
    await supabase.auth.signOut();
  }
}
