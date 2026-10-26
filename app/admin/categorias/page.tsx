'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getToken, getAdmin, clearToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Categoria } from '@/lib/types'

export default function AdminCategoriasPage() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Partial<Categoria> | null>(null)
  const [saving, setSaving] = useState(false)
  const [errorModal, setErrorModal] = useState('')
  const [uploading, setUploading] = useState(false)

  const cargar = useCallback(async (token: string) => {
    const { data } = await supabase.rpc('shop_admin_listar_categorias', { p_token: token })
    setCategorias((data as Categoria[]) || [])
  }, [])

  useEffect(() => {
    const token = getToken()
    if (!token) { router.replace('/admin'); return }
    getAdmin(token).then(a => {
      if (!a) { clearToken(); router.replace('/admin'); return }
      cargar(token).finally(() => setLoading(false))
    })
  }, [router, cargar])

  async function uploadImagen(file: File): Promise<string | null> {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `cat_${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('shop-imagenes').upload(path, file, { upsert: true })
    setUploading(false)
    if (error) { setErrorModal('Error al subir imagen: ' + error.message); return null }
    const { data } = supabase.storage.from('shop-imagenes').getPublicUrl(path)
    return data.publicUrl
  }

  async function guardar() {
    if (!modal?.nombre?.trim()) { setErrorModal('El nombre es obligatorio'); return }
    setSaving(true); setErrorModal('')
    const token = getToken()!
    const datos: Record<string, unknown> = {
      nombre: modal.nombre,
      descripcion: modal.descripcion || null,
      imagen_url: modal.imagen_url || null,
      orden: modal.orden || 0,
      activa: modal.activa !== false,
    }
    if (modal.id) datos.id = modal.id
    const { error } = await supabase.rpc('shop_admin_guardar_categoria', { p_token: token, p_datos: datos })
    if (error) { setErrorModal(error.message); setSaving(false); return }
    await cargar(token)
    setModal(null)
    setSaving(false)
  }

  async function eliminar(id: number) {
    if (!confirm('¿Eliminar esta categoría? Los productos no se eliminan, solo quedarán sin categoría.')) return
    const token = getToken()!
    await supabase.rpc('shop_admin_eliminar_categoria', { p_token: token, p_id: id })
    await cargar(token)
  }

  if (loading) return <Loader />

  const inp = "w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
  const inpStyle = { background: '#0a0a0a', border: '1px solid #2a2a2a' }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <AdminHeader title="Categorías" />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">
            Categorías <span style={{ color: '#555', fontWeight: 400 }}>({categorias.length})</span>
          </h2>
          <button
            onClick={() => { setModal({ activa: true, orden: 0 }); setErrorModal('') }}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-black"
            style={{ background: '#f59e0b' }}>
            + Nueva
          </button>
        </div>

        {categorias.length === 0 ? (
          <div className="rounded-2xl py-16 text-center" style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', color: '#444' }}>
            Sin categorías. Creá la primera.
          </div>
        ) : (
          <div className="space-y-2">
            {categorias.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: '#1c1c1c', border: '1px solid #2a2a2a' }}>
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ background: '#0a0a0a' }}>
                  {c.imagen_url
                    ? <Image src={c.imagen_url} alt={c.nombre} width={48} height={48} className="object-cover w-full h-full" />
                    : <div className="w-full h-full flex items-center justify-center text-xl">🗂</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{c.nombre}</p>
                  {c.descripcion && <p className="text-xs mt-0.5 truncate" style={{ color: '#555' }}>{c.descripcion}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: c.activa ? '#14280f' : '#2a1515', color: c.activa ? '#86efac' : '#f87171' }}>
                    {c.activa ? 'Activa' : 'Inactiva'}
                  </span>
                  <button onClick={() => { setModal({ ...c }); setErrorModal('') }}
                    className="text-xs px-2 py-1 rounded-lg" style={{ color: '#aaa', border: '1px solid #2a2a2a' }}>
                    Editar
                  </button>
                  <button onClick={() => eliminar(c.id)}
                    className="text-xs px-2 py-1 rounded-lg" style={{ color: '#f87171', border: '1px solid #3b1a1a' }}>
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-md rounded-3xl p-6" style={{ background: '#1c1c1c', border: '1px solid #2a2a2a' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white">{modal.id ? 'Editar categoría' : 'Nueva categoría'}</h3>
              <button onClick={() => setModal(null)} style={{ color: '#555', fontSize: 20 }}>×</button>
            </div>
            <div className="space-y-3">
              {/* Imagen */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#888' }}>Imagen</label>
                {modal.imagen_url && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-2" style={{ background: '#0a0a0a' }}>
                    <Image src={modal.imagen_url} alt="preview" fill className="object-cover" />
                    <button onClick={() => setModal(m => ({ ...m!, imagen_url: undefined }))}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>×</button>
                  </div>
                )}
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm"
                  style={{ background: '#0a0a0a', border: '1px dashed #2a2a2a', color: '#666' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {uploading ? 'Subiendo...' : 'Subir imagen'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={async e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const url = await uploadImagen(file)
                      if (url) setModal(m => ({ ...m!, imagen_url: url }))
                    }} />
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#888' }}>Nombre *</label>
                <input className={inp} style={inpStyle} value={modal.nombre || ''}
                  onChange={e => setModal(m => ({ ...m!, nombre: e.target.value }))} placeholder="Nombre de la categoría" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#888' }}>Descripción</label>
                <textarea className={inp} style={{ ...inpStyle, resize: 'vertical', minHeight: 56 }}
                  value={modal.descripcion || ''}
                  onChange={e => setModal(m => ({ ...m!, descripcion: e.target.value }))} placeholder="Descripción opcional..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#888' }}>Orden</label>
                  <input type="number" className={inp} style={inpStyle} value={modal.orden || 0}
                    onChange={e => setModal(m => ({ ...m!, orden: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={modal.activa !== false}
                    onChange={e => setModal(m => ({ ...m!, activa: e.target.checked }))} />
                  <span className="text-sm" style={{ color: '#ccc' }}>Categoría activa</span>
                </label>
              </div>
              {errorModal && <p className="text-xs" style={{ color: '#f87171' }}>{errorModal}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl text-sm"
                  style={{ background: '#2a2a2a', color: '#888' }}>Cancelar</button>
                <button onClick={guardar} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black"
                  style={{ background: '#f59e0b', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
        <Link href="/admin" className="text-sm" style={{ color: '#555' }}>← Admin</Link>
        <span style={{ color: '#2a2a2a' }}>|</span>
        <span className="text-sm text-white font-semibold">{title}</span>
      </div>
    </header>
  )
}
