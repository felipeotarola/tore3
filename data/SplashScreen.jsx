import { useEffect, useState } from 'react'
import './SplashScreen.css'

/**
 * SplashScreen — cinematic logo reveal before the landing page.
 *
 * Animation sequence:
 *  1. White M-shape lines draw on (stroke animation)
 *  2. Tan + gray background rectangles wipe in
 *  3. Top horizontal bar slides down
 *  4. "TOREKULL" text fades up
 *  5. "INTERIOR ARCHITECTURE AND DESIGN" fades up
 *  6. Entire splash fades out and reveals the page beneath
 */
const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('draw') // draw → fill → text → exit

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('fill'), 900),
      setTimeout(() => setPhase('text'), 1600),
      setTimeout(() => setPhase('exit'), 2600),
      setTimeout(() => onComplete?.(), 3400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div className={`splash splash--${phase}`}>
      <div className="splash__logo-wrap">
        <img
          className="splash__logo"
          src="/Torekull_logo_new2.png"
          alt="Torekull"
        />
      </div>
    </div>
  )
}

export default SplashScreen
