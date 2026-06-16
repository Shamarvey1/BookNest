import React from 'react'
import './PremiumBanner.css'
import lockSvg from './premium-lock.svg'

export default function PremiumBanner({ title = 'Premium Chat', subtitle }) {
  return (
    <div className="premium-banner">
      <div className="premium-content">
        <div className="premium-title">{title}</div>
        {subtitle && <div className="premium-subtitle">{subtitle}</div>}
      </div>

      <div className="premium-visual">
        <img src={lockSvg} alt="Premium lock" className="premium-lock-img" />
      </div>
    </div>
  )
}
