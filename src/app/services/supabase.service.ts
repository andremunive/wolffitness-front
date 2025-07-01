// src/app/services/supabase.service.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dusfakzyjlmutvpmujxm.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1c2Zha3p5amxtdXR2cG11anhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MjU2MDYsImV4cCI6MjA2NDQwMTYwNn0.Gj3HXzY4SkdyBTDctKrlkhExuuHf_YYifrmsfcQ7l0o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
