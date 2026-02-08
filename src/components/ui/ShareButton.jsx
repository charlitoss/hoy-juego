import { useState, useRef, useEffect } from 'react'
import { Share2, Check, Link2, MessageCircle, X } from 'lucide-react'
import { Storage } from '../../utils/storage'
import { formatDate } from '../../utils/dateUtils'

function ShareButton({ matchId }) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef(null)
  
  // Get match data for the share message
  const match = Storage.getMatches()[matchId]
  const shortCode = match?.codigoCorto || ''
  const shareUrl = shortCode 
    ? `${window.location.origin}${window.location.pathname}#/p/${shortCode}`
    : `${window.location.origin}${window.location.pathname}#/partido/${matchId}`
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])
  
  // Generate WhatsApp message
  const getWhatsAppMessage = () => {
    if (!match) return shareUrl
    
    const dateInfo = formatDate(match.fecha)
    const playersFormat = `${match.jugadoresPorEquipo} vs ${match.jugadoresPorEquipo}`
    
    return `⚽ *${match.nombre}*

📅 ${dateInfo.dayName} ${dateInfo.day} de ${dateInfo.month} - ${match.horario}hs
📍 ${match.ubicacion}
👥 ${playersFormat}

Anotate acá: ${shareUrl}`
  }
  
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowMenu(false)
      }, 1500)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowMenu(false)
      }, 1500)
    }
  }
  
  const shareWhatsApp = () => {
    const message = encodeURIComponent(getWhatsAppMessage())
    window.open(`https://wa.me/?text=${message}`, '_blank')
    setShowMenu(false)
  }
  
  const copyWhatsAppMessage = async () => {
    const message = getWhatsAppMessage()
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowMenu(false)
      }, 1500)
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = message
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowMenu(false)
      }, 1500)
    }
  }
  
  return (
    <div className="share-button-container" ref={menuRef}>
      <button 
        className={`share-btn ${showMenu ? 'active' : ''}`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <Share2 size={16} />
        <span>Compartir</span>
      </button>
      
      {showMenu && (
        <div className="share-menu">
          <div className="share-menu-header">
            <span>Compartir partido</span>
            <button className="share-menu-close" onClick={() => setShowMenu(false)}>
              <X size={16} />
            </button>
          </div>
          
          {shortCode && (
            <div className="share-code">
              <span className="share-code-label">Código:</span>
              <span className="share-code-value">{shortCode}</span>
            </div>
          )}
          
          <div className="share-menu-options">
            <button className="share-option" onClick={shareWhatsApp}>
              <MessageCircle size={18} />
              <span>Enviar por WhatsApp</span>
            </button>
            
            <button className="share-option" onClick={copyWhatsAppMessage}>
              <MessageCircle size={18} />
              <span>{copied ? '¡Copiado!' : 'Copiar mensaje'}</span>
              {copied && <Check size={16} className="copied-icon" />}
            </button>
            
            <button className="share-option" onClick={copyLink}>
              <Link2 size={18} />
              <span>{copied ? '¡Copiado!' : 'Copiar link'}</span>
              {copied && <Check size={16} className="copied-icon" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShareButton
