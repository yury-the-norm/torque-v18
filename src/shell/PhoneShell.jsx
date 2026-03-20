import React from 'react'

// Exact Figma frame size
export const W = 402
export const H = 874

export default function PhoneShell({ children, showAnnotations, screen }) {
  return (
    <div style={{
      position: 'relative',
      width: W + 20,
      height: H + 20,
      background: 'linear-gradient(160deg, #2c2c2e 0%, #1c1c1e 60%, #0f0f10 100%)',
      borderRadius: 52,
      padding: 10,
      boxShadow: `
        0 0 0 1.5px rgba(255,255,255,0.1),
        0 0 0 3px #0a0a0b,
        0 50px 100px rgba(0,0,0,0.8),
        inset 0 1px 0 rgba(255,255,255,0.06)
      `,
      flexShrink: 0,
    }}>
      {/* Side buttons */}
      {[{t:110,h:32,l:true},{t:154,h:60,l:true},{t:226,h:60,l:true},{t:162,h:88,l:false}].map((b,i)=>(
        <div key={i} style={{
          position:'absolute',
          [b.l?'left':'right']: -3,
          top: b.t,
          width: 3, height: b.h,
          background: '#222224',
          borderRadius: b.l ? '2px 0 0 2px' : '0 2px 2px 0',
        }}/>
      ))}

      {/* Screen */}
      <div style={{
        width: W, height: H,
        borderRadius: 44,
        overflow: 'hidden',
        background: 'var(--bg)',
        position: 'relative',
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: 13, left: '50%',
          transform: 'translateX(-50%)',
          width: 118, height: 34,
          background: '#000',
          borderRadius: 20,
          zIndex: 200,
          pointerEvents: 'none',
        }}/>
        {children}

        {/* Annotation overlay */}
        {showAnnotations && (
          <div style={{
            position:'absolute',inset:0,
            border:'2px dashed rgba(255,214,0,0.5)',
            borderRadius:44,
            pointerEvents:'none',
            zIndex:9999,
          }}>
            <div style={{
              position:'absolute',top:8,left:10,
              background:'rgba(255,214,0,0.92)',
              color:'#000',fontSize:10,fontWeight:700,
              padding:'2px 8px',borderRadius:4,
              fontFamily:'monospace',
            }}>
              {screen?.toUpperCase()||'SCREEN'} · 402×874
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
