import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket name
export const DOCUMENTS_BUCKET = 'documents'

// Helper function to upload file to Supabase storage
export const uploadFile = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  return data
}

// Helper function to get public URL for a file
export const getFileUrl = (path: string) => {
  const { data } = supabase.storage
    .from(DOCUMENTS_BUCKET)
    .getPublicUrl(path)

  return data.publicUrl
}

// Helper function to delete a file
export const deleteFile = async (path: string) => {
  const { error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .remove([path])

  if (error) {
    throw error
  }
}

// Helper function to download a file
export const downloadFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .download(path)

  if (error) {
    throw error
  }

  return data
}