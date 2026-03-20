import React from 'react'

export default function StatusBar({ dark = false }) {
  const color = '#FFFFFF'
  return (
    <div style={{
      position:'absolute', top:0, left:0, right:0,
      height:54, zIndex:100,
      display:'flex', alignItems:'flex-end',
      paddingBottom:8,
    }}>
      {/* Time - left */}
      <div style={{
        width:139, paddingLeft:16,
        fontFamily:'Inter,sans-serif', fontSize:17, fontWeight:600,
        color, letterSpacing:0,
      }}>9:41</div>
      {/* Dynamic Island space */}
      <div style={{flex:1}}/>
      {/* Icons - right */}
      <div style={{
        width:139, paddingRight:16,
        display:'flex', alignItems:'center', justifyContent:'flex-end', gap:7,
      }}>
        {/* Signal bars */}
        <svg width="19" height="12" viewBox="0 0 19 12" fill="none">
          <rect x="0" y="7" width="3" height="5" rx="1" fill={color} opacity="0.4"/>
          <rect x="4" y="4.5" width="3" height="7.5" rx="1" fill={color} opacity="0.6"/>
          <rect x="8" y="2" width="3" height="10" rx="1" fill={color} opacity="0.8"/>
          <rect x="12.5" y="0" width="3" height="12" rx="1" fill={color}/>
          <rect x="16.5" y="0" width="3" height="12" rx="1" fill={color}/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill={color}/>
          <path d="M3.76 6.76a6 6 0 018.48 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M1.05 4.05a10 10 0 0113.9 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={color} strokeOpacity="0.35"/>
          <rect x="2" y="2" width="16" height="8" rx="2" fill={color}/>
          <path d="M23 4v4a2 2 0 000-4z" fill={color} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  )
}
