import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

function ShareButton({ matchId }) {
  const [copied, setCopied] = useState(false)
  
  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/partido/${matchId}`
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  return (
    <button 
      className={`share-btn ${copied ? 'copied' : ''}`}
      onClick={handleShare}
    >
      {copied ? (
        <>
          <Check size={16} />
          <span>¡Copiado!</span>
        </>
      ) : (
        <>
          <Link2 size={16} />
          <span>Compartir</span>
        </>
      )}
    </button>
  )
}

export default ShareButton
