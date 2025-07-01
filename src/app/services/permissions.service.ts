import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private permissions: BehaviorSubject<any>;
}
