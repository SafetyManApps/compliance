export interface Document {
  id: string
  name: string
  type: string
  product_id?: string
  product_name?: string
  description?: string
  file_url?: string
  file_size?: string
  file_path?: string
  status: 'valid' | 'expired' | 'pending'
  expiry_date?: string
  created_at: string
  updated_at: string
}

export interface DocumentInsert {
  name: string
  type: string
  product_id?: string
  product_name?: string
  description?: string
  file_url?: string
  file_size?: string
  file_path?: string
  status?: 'valid' | 'expired' | 'pending'
  expiry_date?: string
}

export interface DocumentUpdate {
  name?: string
  type?: string
  product_id?: string
  product_name?: string
  description?: string
  file_url?: string
  file_size?: string
  file_path?: string
  status?: 'valid' | 'expired' | 'pending'
  expiry_date?: string
}