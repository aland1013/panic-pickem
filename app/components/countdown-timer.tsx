import { useNavigate } from '@remix-run/react'
import { useState, useEffect } from 'react'

export const useCountdown = date => {
  const deadline = new Date(date).getTime()
  const [countdown, setCountdown] = useState(deadline - new Date().getTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(deadline - new Date().getTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  const days = Math.floor(countdown / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000)

  return { countdown, days, hours, minutes, seconds }
}

const CountdownTimer = ({ date }) => {
  const navigate = useNavigate()
  const { countdown, days, hours, minutes, seconds } = useCountdown(date)

  if (countdown === 0) return navigate(0)
  
  if (countdown < 0) return null

  return (
    <div className='flex justify-center pb-4'>
      <span className='pr-2'>Picks are locked in</span>
      {days > 0 ? `${days < 10 ? `0${days}` : days}:` : '00:'}
      {hours > 0 ? `${hours < 10 ? `0${hours}` : hours}:` : '00:'}
      {minutes > 0 ? `${minutes < 10 ? `0${minutes}` : minutes}:` : '00:'}
      {seconds > 0 ? `${seconds < 10 ? `0${seconds}` : seconds}` : '00'}
    </div>
  )
}

export default CountdownTimer
