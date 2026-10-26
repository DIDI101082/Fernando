'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getToken, getAdmin, clearToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { ShopConfig } from '@/lib/types'

const CAMPOS: { key: keyof ShopConfig; label: string; placeholder: string; tipo?: string; hint?: string }[] = [
  { key: 'nombre_negocio',     label: 'Nombre del negocio',    placeholder: 'Ej: La Esquina Gourmet' },
  { key: 'descripcion_negocio', label: 'Descripción breve',    placeholder: 'Ej: Alimentos y bebidas artesanales', tipo: 'textarea' },
  { key: 'whatsapp',           label: 'Número de WhatsApp',    placeholder: 'Ej: 5491112345678', hint: 'Código de país + número, sin +, sin espacios. Ej: 5491112345678' },
  { key: 'moneda',             label: 'Símbolo de moneda',     placeholder: 'Ej: $ o USD', hint: 'Se muestra antes del precio' },
  { key: 'color_acento',       label: 'Color de acento',       placeholder: '#f59e0b', tipo: 'color', hint: 'Color principal del catálogo (hexadecimal)' },
  { key: 'instagram',          label: 'Instagram',             placeholder: '@mi_negocio', hint: 'Con o sin @. Deja vacío para no mostrar' },
  { key: 'facebook',           label: 'Facebook',              placeholder: 'mi.negocio', hint: 'URL o nombre de página. Deja vacío para no mostrar' },
]

export default function AdminConfigPage() {
  const router = useRouter()
  const [config, setConfig] = useState<Partial<ShopConfig>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const cargar = useCallback(async (token: string) => {
    const { data } = await supabase.rpc('shop_admin_get_config', { p_token: token })
    if (data) setConfig(data as ShopConfig)
  }, [])

  useEffect(() => {
    const token = getToken()
    if (!token) { router.replace('/admin'); return }
    getAdmin(token).then(a => {
      if (!a) { clearToken(); router.replace('/admin'); return }
      cargar(token).finally(() => setLoading(false))
    })
  }, [router, cargar])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setSaved(false)
    const token = getToken()!
    const { error: err } = await supabase.rpc('shop_admin_set_config', {
      p_token: token,
      p_datos: config,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <Loader />

  const inp = "w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
  const inpStyle = { background: '#0a0a0a', border: '1px solid #2a2a2a' }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <AdminHeader title="Configuración" />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h2 className="text-lg font-bold text-white mb-6">Configuración del negocio</h2>
        <form onSubmit={guardar}>
          <div className="rounded-2xl p-5 space-y-5" style={{ background: '#1c1c1c', border: '1px solid #2a2a2a' }}>
            {CAMPOS.map(campo => (
              <div key={campo.key}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#888' }}>{campo.label}</label>
                {campo.tipo === 'textarea' ? (
                  <textarea
                    className={inp}
                    style={{ ...inpStyle, resize: 'vertical', minHeight: 68 }}
                    value={config[campo.key] || ''}
                    onChange={e => setConfig(c => ({ ...c, [campo.key]: e.target.value }))}
                    placeholder={campo.placeholder}
                  />
                ) : campo.tipo === 'color' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      className={inp}
                      style={inpStyle}
                      value={config[campo.key] || ''}
                      onChange={e => setConfig(c => ({ ...c, [campo.key]: e.target.value }))}
                      placeholder={campo.placeholder}
                    />
                    <label className="relative shrink-0 w-10 h-10 rounded-xl overflow-hidden cursor-pointer"
                      style={{ border: '2px solid #2a2a2a' }}>
                      <input
                        type="color"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        value={config[campo.key] || '#f59e0b'}
                        onChange={e => setConfig(c => ({ ...c, [campo.key]: e.target.value }))}
                      />
                      <div className="w-full h-full rounded-xl"
                        style={{ background: config[campo.key] || '#f59e0b' }} />
                    </label>
                  </div>
                ) : (
                  <input
                    type="text"
                    className={inp}
                    style={inpStyle}
                    value={config[campo.key] || ''}
                    onChange={e => setConfig(c => ({ ...c, [campo.key]: e.target.value }))}
                    placeholder={campo.placeholder}
                  />
                )}
                {campo.hint && (
                  <p className="text-xs mt-1" style={{ color: '#555' }}>{campo.hint}</p>
                )}
              </div>
            ))}
          </div>

          {/* Preview WhatsApp link */}
          {config.whatsapp && (
            <div className="mt-4 p-4 rounded-xl" style={{ background: '#0d1f0f', border: '1px solid #1a3a1a' }}>
              <p className="text-xs font-medium mb-1" style={{ color: '#4ade80' }}>Vista previa botón WhatsApp:</p>
              <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener"
                className="text-xs" style={{ color: '#86efac' }}>
                https://wa.me/{config.whatsapp}
              </a>
            </div>
          )}

          {error && <p className="mt-3 text-xs" style={{ color: '#f87171' }}>{error}</p>}

          <div className="mt-5 flex items-center gap-3">
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-black transition-opacity"
              style={{ background: '#f59e0b', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {saved && (
              <span className="text-sm font-medium" style={{ color: '#86efac' }}>
                ✓ Guardado
              </span>
            )}
          </div>
        </form>

        <div className="mt-8 p-4 rounded-xl" style={{ background: '#141414', border: '1px solid #1c1c1c' }}>
          <p className="text-xs font-medium mb-2" style={{ color: '#555' }}>Ver catálogo público</p>
          <Link href="/" className="text-sm" style={{ color: '#f59e0b' }}>
            → Ir al catálogo ↗
          </Link>
        </div>
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
      <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
    </div>
  )
}

function AdminHeader({ title }: { title: string }) {
  return (
    <header style={{ background: '#141414', borderBottom: '1px solid #2a2a2a' }}>
      <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
        <Link href="/admin" className="text-sm" style={{ color: '#555' }}>← Admin</Link>
        <span style={{ color: '#2a2a2a' }}>|</span>
        <span className="text-sm text-white font-semibold">{title}</span>
      </div>
    </header>
  )
}
