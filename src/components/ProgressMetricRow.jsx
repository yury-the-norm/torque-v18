import React from 'react'
import patternImg from '../assets/pattern.png'

/* Figma: container w=354 h=28 r=2
   bar: absolute x=2 y=4 h=20 r=2, colored
   Pattern texture overlay on bar
   Text: Space Mono 13px label fw=400 value fw=700
*/

export default function ProgressMetricRow({ label, value, barWidth, barColor }) {
  return (
    <div style={{
      width: 354, height: 28,
      borderRadius: 2,
      background: 'rgba(255,255,255,0.05)',
      position: 'relative',
    }}>
      {/* Colored bar */}
      <div style={{
        position: 'absolute',
        left: 2, top: 4,
        width: Math.max(0, barWidth - 4),
        height: 20,
        borderRadius: 2,
        background: barColor,
        overflow: 'hidden',
      }}>
        {/* Pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${patternImg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '12px 32px',
          opacity: 0.25,
          mixBlendMode: 'overlay',
        }}/>
      </div>

      {/* Label */}
      <span style={{
        position: 'absolute',
        left: 10, top: '50%', transform: 'translateY(-50%)',
        fontFamily: 'Space Mono, monospace', fontSize: 13, fontWeight: 400,
        color: 'rgba(255,255,255,0.85)',
        pointerEvents: 'none',
        zIndex: 1,
      }}>{label}</span>

      {/* Value */}
      <span style={{
        position: 'absolute',
        right: 8, top: '50%', transform: 'translateY(-50%)',
        fontFamily: 'Space Mono, monospace', fontSize: 13, fontWeight: 700,
        color: '#fff',
        pointerEvents: 'none',
        zIndex: 1,
      }}>{value}</span>
    </div>
  )
}
