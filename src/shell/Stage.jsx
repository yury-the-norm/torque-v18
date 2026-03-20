import React from 'react'

export default function Stage({ children }) {
  return (
    <div style={{
      width:'100vw', height:'100vh',
      background: `radial-gradient(ellipse 70% 50% at 50% 40%, rgba(240,78,35,0.07) 0%, transparent 65%),
                   radial-gradient(ellipse 50% 70% at 85% 85%, rgba(45,127,249,0.05) 0%, transparent 55%),
                   #0a0a0b`,
      display:'flex', alignItems:'center', justifyContent:'center',
      position:'relative', overflow:'hidden',
    }}>
      {/* Grid */}
      <div style={{
        position:'absolute',inset:0,
        backgroundImage:`linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
                         linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`,
        backgroundSize:'44px 44px',
        pointerEvents:'none',
      }}/>
      {/* Logo */}
      <div style={{
        position:'absolute',top:24,left:32,
        fontFamily:'Teko,sans-serif',fontSize:20,fontWeight:600,
        letterSpacing:'0.14em',color:'rgba(255,255,255,0.18)',
        textTransform:'uppercase',
      }}>TORQUE CONNECT</div>
      {/* Badge */}
      <div style={{
        position:'absolute',top:24,right:32,
        background:'rgba(240,78,35,0.12)',
        border:'1px solid rgba(240,78,35,0.25)',
        color:'#F04E23',fontSize:11,fontWeight:600,
        letterSpacing:'0.1em',padding:'4px 12px',
        borderRadius:4,fontFamily:'Inter,sans-serif',
        textTransform:'uppercase',
      }}>Prototype v2</div>
      {/* M hint */}
      <div style={{
        position:'absolute',bottom:20,left:'50%',transform:'translateX(-50%)',
        fontFamily:'monospace',fontSize:11,
        color:'rgba(255,255,255,0.25)',
        background:'rgba(255,255,255,0.04)',
        border:'1px solid rgba(255,255,255,0.08)',
        padding:'5px 14px',borderRadius:16,
        pointerEvents:'none',
      }}>Press <strong style={{color:'rgba(255,255,255,0.5)'}}>M</strong> — annotations</div>
      {children}
    </div>
  )
}
