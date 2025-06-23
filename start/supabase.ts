import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gmnecwjcmjvprudihtfz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbmVjd2pjbWp2cHJ1ZGlodGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjA2MDIsImV4cCI6MjA2NTg5NjYwMn0.4vnTZ2UZasr6Ja-_68NDaIErWFS1wE0LJXrJJ25uwtw'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase