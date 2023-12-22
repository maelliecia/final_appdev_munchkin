import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://rncthufdocuirpatufrc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuY3RodWZkb2N1aXJwYXR1ZnJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjcyOTcxMywiZXhwIjoyMDE4MzA1NzEzfQ.7QYHCxfRyUwHsu8EjKMnhdC4aweCMEFibCBNg-Hm1Mg'
)