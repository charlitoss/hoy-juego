import { useState, useEffect } from 'react'

function Countdown({ targetDate, targetTime }) {
  const [timeLeft, setTimeLeft] = useState(null)
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Parse target date and time
      const [year, month, day] = targetDate.split('-').map(Number)
      const [hours, minutes] = targetTime.split(':').map(Number)
      
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
  
  return (
    <div className="countdown">
      <span className="countdown-label">Jugamos en</span>
      <span className="countdown-time">
        {days > 0 && <><span className="countdown-days">{days} {days === 1 ? 'día' : 'días'}</span>, </>}
        <span className="countdown-hms">
          {hours.toString().padStart(2, '0')} : {minutes.toString().padStart(2, '0')} : {seconds.toString().padStart(2, '0')}
        </span>
      </span>
    </div>
  )
}

export default Countdown
