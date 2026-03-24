import React from 'react'
import patternImg from '../assets/pattern.png'

export default function ProgressMetricRow({ label, value, barWidth, barColor }) {
  return (
    <div style={{
      width: '100%',
      height: 28, borderRadius: 2,
      background: 'rgba(255,255,255,0.05)',
      position: 'relative',
    }}>
      {/* Coloured bar — width is a proportion of --card-w */}
      <div style={{
        position: 'absolute', left: 2, top: 4,
        width: `calc((${Math.max(0, barWidth)} / 370) * (var(--card-w, 354px) - 4px))`,
        height: 20, borderRadius: 2,
        background: barColor, overflow: 'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage: `url(${patternImg})`,
          backgroundRepeat: 'repeat', backgroundSize: '12px 32px',
          opacity: 0.25, mixBlendMode: 'overlay',
        }}/>
      </div>
      <span style={{
        position:'absolute', left:10, top:'50%', transform:'translateY(-50%)',
        fontFamily:'Space Mono,monospace', fontSize:13, fontWeight:400,
        color:'rgba(255,255,255,0.85)', pointerEvents:'none', zIndex:1,
      }}>{label}</span>
      <span style={{
        position:'absolute', right:8, top:'50%', transform:'translateY(-50%)',
        fontFamily:'Space Mono,monospace', fontSize:13, fontWeight:700,
        color:'#fff', pointerEvents:'none', zIndex:1,
      }}>{value}</span>
    </div>
  )
}
