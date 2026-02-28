import { useState, useEffect } from 'react'
import { Timer } from 'lucide-react'

function Countdown({ targetDate, targetTime }) {
  const [timeLeft, setTimeLeft] = useState(null)
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Validate inputs
      if (!targetDate || !targetTime) {
        return null
      }
      
      try {
        // Parse target date and time
        const [year, month, day] = targetDate.split('-').map(Number)
        const [hours, minutes] = targetTime.split(':').map(Number)
        
        // Validate parsed values
        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
          return null
        }
        
        const target = new Date(year, month - 1, day, hours, minutes, 0)
        const now = new Date()
        const difference = target - now
        
        if (difference <= 0) {
          return null // Match has started or passed
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hoursLeft = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutesLeft = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const secondsLeft = Math.floor((difference % (1000 * 60)) / 1000)
        
        return { days, hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft }
      } catch (e) {
        return null
      }
    }
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft())
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [targetDate, targetTime])
  
  if (!timeLeft) {
    return null // Don't show countdown if match has passed
  }
  
  const { days, hours, minutes, seconds } = timeLeft
  
  // Build countdown text: "Jugamos en xd xx:xx:xx"
  const timePart = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  const countdownText = days > 0 
    ? `Jugamos en ${days}d ${timePart}`
    : `Jugamos en ${timePart}`
  
  return (
    <div className="info-item countdown-inline">
      <Timer size={18} />
      <span className="countdown-text">{countdownText}</span>
    </div>
  )
}

export default Countdown
