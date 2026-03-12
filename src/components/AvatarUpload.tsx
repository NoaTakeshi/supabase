// src/components/AvatarUpload.tsx
import { useState } from 'react'
import { storageService } from '../services/storageService'
import { useAuthContext } from '../context/AuthContext'

export function AvatarUpload() {
  const { user }      = useAuthContext()
  const [url, setUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type))
      return alert('Solo JPG, PNG, GIF o WebP')
    if (file.size > 2 * 1024 * 1024)
      return alert('Máximo 2 MB')

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      await storageService.avatares.upload(user.id, file)
      const url = storageService.avatares.getPublicUrl(user.id, ext)
      setUrl(url)
    } catch (err: any) { alert(err.message) }
    finally { setUploading(false) }
  }

  return (
    <div>
      {url && <img src={url} alt="Avatar" style={{ width: 80, height: 80, borderRadius: '50%' }} />}
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <span>Subiendo...</span>}
    </div>
  )
}