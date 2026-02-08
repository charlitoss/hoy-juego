import { useState } from 'react'
import { ArrowLeft, Calendar, Clock, MapPin, Users, Edit2, Check, X, UserPlus } from 'lucide-react'
import ShareButton from '../ui/ShareButton'
import Countdown from '../ui/Countdown'
import { Storage } from '../../utils/storage'
import { formatDate } from '../../utils/dateUtils'

function EditableMatchHeader({ match, onMatchUpdate, onBack, onAddPlayer }) {
  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState('')
  
  const dateInfo = formatDate(match.fecha)
  
  const startEdit = (field, currentValue) => {
    setEditingField(field)
    setEditValue(currentValue)
  }
  
  const cancelEdit = () => {
    setEditingField(null)
    setEditValue('')
  }
  
  const saveEdit = () => {
    if (!editValue.trim() && editingField !== 'detallesUbicacion') {
      cancelEdit()
      return
    }
    
    const updatedMatch = {
      ...match,
      [editingField]: editingField === 'jugadoresPorEquipo' 
        ? parseInt(editValue, 10) 
        : editValue.trim()
    }
    
    Storage.saveMatch(updatedMatch)
    onMatchUpdate(updatedMatch)
    cancelEdit()
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }
  
  // Render editable field
  const renderEditableText = (field, value, icon, placeholder) => {
    if (editingField === field) {
      return (
        <div className="editable-field editing">
          {icon}
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus
            className="editable-input"
          />
          <button className="edit-action-btn save" onClick={saveEdit}>
            <Check size={14} />
          </button>
          <button className="edit-action-btn cancel" onClick={cancelEdit}>
            <X size={14} />
          </button>
        </div>
      )
    }
    
    return (
      <div 
        className="editable-field"
        onClick={() => startEdit(field, value)}
      >
        {icon}
        <span>{value || placeholder}</span>
        <Edit2 size={12} className="edit-icon" />
      </div>
    )
  }
  
  // Render editable date
  const renderEditableDate = () => {
    if (editingField === 'fecha') {
      return (
        <div className="editable-field editing">
          <Calendar size={18} />
          <input
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="editable-input"
          />
          <button className="edit-action-btn save" onClick={saveEdit}>
            <Check size={14} />
          </button>
          <button className="edit-action-btn cancel" onClick={cancelEdit}>
            <X size={14} />
          </button>
        </div>
      )
    }
    
    return (
      <div 
        className="editable-field"
        onClick={() => startEdit('fecha', match.fecha)}
      >
        <Calendar size={18} />
        <span>{dateInfo.dayName} {dateInfo.day} de {dateInfo.month}, {dateInfo.year}</span>
        <Edit2 size={12} className="edit-icon" />
      </div>
    )
  }
  
  // Render editable time
  const renderEditableTime = () => {
    if (editingField === 'horario') {
      return (
        <div className="editable-field editing">
          <Clock size={18} />
          <input
            type="time"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="editable-input"
          />
          <button className="edit-action-btn save" onClick={saveEdit}>
            <Check size={14} />
          </button>
          <button className="edit-action-btn cancel" onClick={cancelEdit}>
            <X size={14} />
          </button>
        </div>
      )
    }
    
    return (
      <div 
        className="editable-field"
        onClick={() => startEdit('horario', match.horario)}
      >
        <Clock size={18} />
        <span>{match.horario}</span>
        <Edit2 size={12} className="edit-icon" />
      </div>
    )
  }
  
  // Render editable players per team
  const renderEditablePlayersPerTeam = () => {
    if (editingField === 'jugadoresPorEquipo') {
      return (
        <div className="editable-field editing">
          <Users size={18} />
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
            className="editable-select"
          >
            {[5, 6, 7, 8, 9, 10, 11].map(n => (
              <option key={n} value={n}>{n} vs {n}</option>
            ))}
          </select>
          <button className="edit-action-btn save" onClick={saveEdit}>
            <Check size={14} />
          </button>
          <button className="edit-action-btn cancel" onClick={cancelEdit}>
            <X size={14} />
          </button>
        </div>
      )
    }
    
    return (
      <div 
        className="editable-field"
        onClick={() => startEdit('jugadoresPorEquipo', match.jugadoresPorEquipo.toString())}
      >
        <Users size={18} />
        <span>{match.jugadoresPorEquipo} vs {match.jugadoresPorEquipo}</span>
        <Edit2 size={12} className="edit-icon" />
      </div>
    )
  }
  
  // Render editable title
  const renderEditableTitle = () => {
    if (editingField === 'nombre') {
      return (
        <div className="editable-title editing">
          <span>⚽</span>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nombre del partido"
            autoFocus
            className="editable-title-input"
          />
          <button className="edit-action-btn save" onClick={saveEdit}>
            <Check size={16} />
          </button>
          <button className="edit-action-btn cancel" onClick={cancelEdit}>
            <X size={16} />
          </button>
        </div>
      )
    }
    
    return (
      <h1 
        className="editable-title"
        onClick={() => startEdit('nombre', match.nombre)}
      >
        <span>⚽</span>
        {match.nombre}
        <Edit2 size={14} className="edit-icon" />
      </h1>
    )
  }
  
  return (
    <div className="match-header">
      <div className="match-header-top">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        {renderEditableTitle()}
        {onAddPlayer && (
          <button className="btn-add-player" onClick={onAddPlayer} title="Agregar jugador">
            <UserPlus size={18} />
          </button>
        )}
        <ShareButton matchId={match.id} />
      </div>
      
      <div className="match-header-info editable-info">
        {renderEditableTime()}
        {renderEditableText('ubicacion', match.ubicacion, <MapPin size={18} />, 'Ubicación')}
        {renderEditableDate()}
        {renderEditablePlayersPerTeam()}
        {match.detallesUbicacion && (
          <div className="info-item">
            <span style={{ marginLeft: '26px', fontStyle: 'italic' }}>
              {match.detallesUbicacion}
            </span>
          </div>
        )}
      </div>
      
      {/* Countdown */}
      <Countdown targetDate={match.fecha} targetTime={match.horario} />
    </div>
  )
}

export default EditableMatchHeader
