import { supabase } from './supabase'
import { Admin } from './types'

const KEY = 'shop_admin_token'

export const getToken = (): string | null =>
  typeof window !== 'undefined' ? localStorage.getItem(KEY) : null

export const setToken = (t: string) => localStorage.setItem(KEY, t)
export const clearToken = () => localStorage.removeItem(KEY)

export async function adminLogin(email: string, password: string): Promise<{ token: string; admin: Admin }> {
  const { data, error } = await supabase.rpc('shop_login', { p_email: email, p_password: password })
  if (error) throw new Error(error.message)
  if (!data?.token) throw new Error('Credenciales incorrectas')
  return data as { token: string; admin: Admin }
}

export async function adminLogout(token: string) {
  await supabase.rpc('shop_logout', { p_token: token })
  clearToken()
}

export async function getAdmin(token: string): Promise<Admin | null> {
  const { data } = await supabase.rpc('shop_mi_sesion', { p_token: token })
  return data as Admin | null
}
