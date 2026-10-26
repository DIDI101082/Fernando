'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminLogin, adminLogout, getToken, setToken, clearToken, getAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Admin } from '@/lib/types'

export default function AdminPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [logging, setLogging] = useState(false)
  const [stats, setStats] = useState({ productos: 0, categorias: 0 })

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    getAdmin(token).then(a => {
      if (!a) { clearToken(); setLoading(false); return }
      setAdmin(a)
      // Cargar stats
      Promise.all([
        supabase.rpc('shop_admin_listar_productos', { p_token: token }),
        supabase.rpc('shop_admin_listar_categorias', { p_token: token }),
      ]).then(([prods, cats]) => {
        setStats({
          productos: (prods.data as any[])?.length ?? 0,
          categorias: (cats.data as any[])?.length ?? 0,
        })
      })
      setLoading(false)
    })
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLogging(true)
    try {
      const { token, admin: a } = await adminLogin(email, password)
      setToken(token)
      setAdmin(a)
    } catch (err: any) {
      setError(err.message)
    } finally { setLogging(false) }
  }

  async function handleLogout() {
    const token = getToken()
    if (token) await adminLogout(token)
    setAdmin(null)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
      <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
    </div>
  )

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0a' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4" style={{ background: '#f59e0b' }}>
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Panel Admin</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="rounded-2xl p-5 space-y-3" style={{ background: '#1c1c1c', border: '1px solid #2a2a2a' }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="Email" className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none"
                style={{ background: '#0a0a0a', border: '1px solid #2a2a2a' }} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="Contraseña" className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none"
                style={{ background: '#0a0a0a', border: '1px solid #2a2a2a' }} />
              {error && <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>}
            </div>
            <button type="submit" disabled={logging}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-black"
              style={{ background: '#f59e0b', opacity: logging ? 0.7 : 1 }}>
              {logging ? 'Ingresando...' : 'Ingresar'}
            </button>
            <Link href="/" className="block text-center text-xs" style={{ color: '#555' }}>
              ← Ver catálogo
            </Link>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <header style={{ background: '#141414', borderBottom: '1px solid #2a2a2a' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm" style={{ color: '#555' }}>← Catálogo</Link>
            <span style={{ color: '#2a2a2a' }}>|</span>
            <span className="text-sm text-white font-semibold">Panel Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: '#555' }}>{admin.nombre}</span>
            <button onClick={handleLogout} className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: '#666', border: '1px solid #2a2a2a' }}>
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-lg font-bold text-white mb-6">Inicio</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Productos" value={stats.productos} href="/admin/productos" />
          <StatCard label="Categorías" value={stats.categorias} href="/admin/categorias" />
          <StatCard label="Configuración" value="⚙" href="/admin/config" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AdminLink href="/admin/productos" label="Gestionar productos" icon="📦" />
          <AdminLink href="/admin/categorias" label="Gestionar categorías" icon="🗂" />
          <AdminLink href="/admin/config" label="Configuración del negocio" icon="⚙️" />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, href }: { label: string; value: number | string; href: string }) {
  return (
    <Link href={href} className="rounded-2xl p-5 block transition-colors"
      style={{ background: '#1c1c1c', border: '1px solid #2a2a2a' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#f59e0b')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm mt-1" style={{ color: '#555' }}>{label}</p>
    </Link>
  )
}

function AdminLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-4 rounded-2xl transition-colors"
      style={{ background: '#1c1c1c', border: '1px solid #2a2a2a' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#232323')}
      onMouseLeave={e => (e.currentTarget.style.background = '#1c1c1c')}>
      <span className="text-xl">{icon}</span>
      <span className="text-sm text-white">{label}</span>
    </Link>
  )
}
