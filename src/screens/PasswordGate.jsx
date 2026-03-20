import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PWD = import.meta.env.VITE_APP_PASSWORD || 'torque2025'

export default function PasswordGate({ onUnlock }) {
  const [val, setVal]   = useState('')
  const [err, setErr]   = useState(false)
  const [shake, setShk] = useState(false)

  function attempt() {
    if (val === PWD) { onUnlock(); return }
    setErr(true); setShk(true); setVal('')
    setTimeout(() => setShk(false), 500)
    setTimeout(() => setErr(false), 1800)
  }

  return (
    <div style={{
      width:'100%', height:'100%',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      padding:32,
    }}>
      <motion.div
        initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}}
        style={{ marginBottom:40, textAlign:'center' }}
      >
        <div style={{
          width:72, height:72,
          background:'linear-gradient(135deg,#F04E23,#c93b18)',
          borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 16px',
          boxShadow:'0 8px 32px rgba(240,78,35,0.35)',
        }}>
          <span style={{ fontFamily:'Teko,sans-serif', fontSize:48, fontWeight:700, color:'#fff', lineHeight:1 }}>T</span>
        </div>
        <div style={{ fontFamily:'Teko,sans-serif', fontSize:32, fontWeight:400, color:'#fff', letterSpacing:'2px', textTransform:'uppercase' }}>TORQUE</div>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300, color:'rgba(255,255,255,0.4)', letterSpacing:'0.12em', textTransform:'uppercase', marginTop:4 }}>Prototype Access</div>
      </motion.div>

      <motion.div animate={shake ? {x:[-10,10,-8,8,-4,4,0]} : {}} transition={{duration:0.45}} style={{width:'100%'}}>
        <div style={{
          background:'rgba(255,255,255,0.05)',
          border:`1px solid ${err ? '#F04E23' : 'rgba(255,255,255,0.1)'}`,
          borderRadius:8, display:'flex', alignItems:'center',
          padding:'0 16px', marginBottom:8,
          transition:'border-color 0.2s',
        }}>
          <input
            type="password"
            placeholder="Enter password"
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key==='Enter' && attempt()}
            autoFocus
            style={{
              flex:1, background:'none', border:'none', outline:'none',
              color:'#fff', fontSize:16, padding:'14px 0',
              fontFamily:'Inter,sans-serif', letterSpacing:'0.1em',
            }}
          />
        </div>

        <AnimatePresence>
          {err && (
            <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              style={{ fontFamily:'Inter,sans-serif', fontSize:12, color:'#F04E23', textAlign:'center', marginBottom:8 }}
            >Incorrect password</motion.div>
          )}
        </AnimatePresence>

        <button onClick={attempt} className="pressable" style={{
          width:'100%', height:44, borderRadius:6,
          background:'#F04E23', border:'none',
          fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
          letterSpacing:'1.1px', color:'#fff', cursor:'pointer',
        }}>ENTER</button>
      </motion.div>
    </div>
  )
}
