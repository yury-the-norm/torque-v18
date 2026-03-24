import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import tankImg from '../assets/tank_m1.png'
import anotherTank from '../assets/another_tank.png'

/*
 Figma Scan new (262:8901) exact specs:
 - NFC Container: 370×300 r=8 bg=#1C1D21
   • border: 1px solid #2D7FF9 (idle)
   • border: 2px solid rotating radial gradient (connecting)
 - nfc 1 icon: 64×64 at x=153 y=64 (centred in 370px)
 - "Tap to connect": Teko size=32 at y=144
 - Subheading: y=196
 - "Bluetooth will activate automatically.": y=340
 - "Can't find the NFC tag?": button y=392
 - "Back": button y=780
*/

const PAGE = { duration: 0.26, ease: [0.32, 0.72, 0, 1] }

/* ── NFC SVG icon (inline from uploaded file) ─────── */
function NfcIcon({ size = 64, color = '#2D7FF9' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M29.3334 53.3333C27.2116 53.3333 25.1768 52.4905 23.6765 50.9902C22.1762 49.4899 21.3334 47.4551 21.3334 45.3333V16L34.6667 29.3333"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M34.6667 10.6667C36.7884 10.6667 38.8233 11.5095 40.3236 13.0098C41.8239 14.5101 42.6667 16.5449 42.6667 18.6667V48L29.3334 34.6667"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.6666 18.6667C10.6666 16.5449 11.5095 14.5101 13.0098 13.0098C14.5101 11.5095 16.5449 10.6667 18.6666 10.6667H45.3333C47.455 10.6667 49.4899 11.5095 50.9901 13.0098C52.4904 14.5101 53.3333 16.5449 53.3333 18.6667V45.3333C53.3333 47.4551 52.4904 49.4899 50.9901 50.9902C49.4899 52.4905 47.455 53.3333 45.3333 53.3333H18.6666C16.5449 53.3333 14.5101 52.4905 13.0098 50.9902C11.5095 49.4899 10.6666 47.4551 10.6666 45.3333V18.6667Z"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ── Animated border: rotating radial gradient ────── */
function AnimatedBorder({ w = 370, h = 300, r = 8, isConnecting = false }) {
  const [angle, setAngle] = useState(0)

  useAnimationFrame((t) => {
    if (isConnecting) setAngle(t * 0.12 % 360)  // ~0.12 deg/ms ≈ 2s/rev
  })

  if (!isConnecting) {
    // Idle: thin 1px #2D7FF9 border
    return (
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: r, border: '1px solid rgba(45,127,249,0.5)',
        pointerEvents: 'none',
      }}/>
    )
  }

  // Connecting: thick border with rotating conic gradient
  const rad = angle * Math.PI / 180
  const cx = 50 + Math.cos(rad) * 50   // gradient hotspot orbits around box
  const cy = 50 + Math.sin(rad) * 50

  return (
    <>
      {/* Glow layer behind */}
      <div style={{
        position: 'absolute', inset: -3, borderRadius: r + 3,
        background: `radial-gradient(circle at ${cx}% ${cy}%, rgba(45,127,249,0.35) 0%, transparent 60%)`,
        pointerEvents: 'none',
        filter: 'blur(4px)',
      }}/>
      {/* Border itself via box-shadow + outline trick */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: r,
        border: '2px solid transparent',
        backgroundClip: 'padding-box',
        pointerEvents: 'none',
        boxShadow: `0 0 0 2px rgba(45,127,249,0.9), 0 0 16px rgba(45,127,249,0.4), 0 0 32px rgba(45,127,249,0.2)`,
      }}/>
      {/* Rotating bright arc using SVG */}
      <svg style={{ position:'absolute', inset:0, borderRadius:r, pointerEvents:'none' }}
        width={w} height={h}>
        <defs>
          <linearGradient id="arcGrad" x1={`${cx}%`} y1={`${cy}%`} x2="50%" y2="50%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2D7FF9" stopOpacity="1"/>
            <stop offset="40%" stopColor="#2D7FF9" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#2D7FF9" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect x="1" y="1" width={w-2} height={h-2} rx={r} ry={r}
          fill="none" stroke="url(#arcGrad)" strokeWidth="2"/>
      </svg>
    </>
  )
}

/* ── NFC Container box ────────────────────────────── */
function NFCBox({ isConnecting, onTap }) {
  const ref = React.useRef()
  const [boxW, setBoxW] = React.useState(370)
  React.useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(entries => setBoxW(entries[0].contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
      style={{
        width: '100%', height: 300, borderRadius: 8,
        background: '#1C1D21',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'visible',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 12,
      }}
    >
      <AnimatedBorder w={boxW} h={300} r={8} isConnecting={isConnecting}/>

      {/* NFC icon — centred via flex */}
      <motion.div
        animate={isConnecting ? { scale: [1, 1.06, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        style={{ width: 64, height: 64, flexShrink: 0 }}
      >
        <NfcIcon size={64} color={isConnecting ? '#fff' : '#2D7FF9'}/>
      </motion.div>

      {/* Text block — centred */}
      <div style={{ textAlign: 'center', padding: '0 16px' }}>
        <div style={{
          fontFamily: 'Teko, sans-serif', fontSize: 32, fontWeight: 400,
          color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em',
          lineHeight: '36px', marginBottom: 8,
        }}>
          {isConnecting ? 'Connecting…' : 'Tap to connect'}
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 300,
          color: 'rgba(255,255,255,0.55)', lineHeight: '22px',
        }}>
          {isConnecting
            ? 'Hold your phone to the NFC tag'
            : <>Find the NFC mark on the equipment<br/>and tap your phone to connect.</>
          }
        </div>
      </div>
    </motion.div>
  )
}

/* ── Step 0: Tap to connect ──────────────────────── */
function TapToConnect({ onTap, onCantFind, onBack }) {
  return (
    <motion.div key="tap"
      initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:-40 }} transition={PAGE}
      style={{
        position:'absolute', inset:0,
        display:'flex', flexDirection:'column',
        padding:'16px 16px 0',
      }}>

      {/* NFC Box — full width */}
      <NFCBox isConnecting={false} onTap={onTap}/>

      {/* Text below box */}
      <div style={{
        textAlign:'center', marginTop:24,
        fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
        color:'rgba(255,255,255,0.35)',
      }}>Bluetooth will activate automatically.</div>

      <motion.button onClick={onCantFind} whileTap={{ scale:0.96 }}
        style={{
          marginTop:16, background:'none', border:'none', cursor:'pointer',
          fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:300,
          color:'rgba(255,255,255,0.4)', textDecoration:'underline',
          alignSelf:'center',
        }}>Can't find the NFC tag?</motion.button>

      {/* Back — pushed to bottom */}
      <motion.button onClick={onBack} whileTap={{ scale:0.96 }}
        style={{
          marginTop:'auto', marginBottom:24, background:'none', border:'none',
          cursor:'pointer', fontFamily:'Teko,sans-serif', fontSize:24,
          fontWeight:400, letterSpacing:'0.5px', color:'rgba(255,255,255,0.35)',
          alignSelf:'center',
        }}>Back</motion.button>
    </motion.div>
  )
}

/* ── Step 1: Connecting (border animates) ─────────── */
function ConnectingScreen({ onCancel }) {
  return (
    <motion.div key="connecting"
      initial={{ opacity:0 }} animate={{ opacity:1 }}
      exit={{ opacity:0 }} transition={PAGE}
      style={{
        position:'absolute', inset:0,
        display:'flex', flexDirection:'column',
        padding:'16px 16px 0',
      }}>

      <NFCBox isConnecting={true} onTap={() => {}}/>

      <div style={{
        textAlign:'center', marginTop:24,
        fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
        color:'rgba(255,255,255,0.35)',
      }}>Bluetooth will activate automatically.</div>

      <motion.button onClick={onCancel} whileTap={{ scale:0.96 }}
        style={{
          marginTop:'auto', marginBottom:24,
          background:'none', border:'none', cursor:'pointer',
          fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:400,
          letterSpacing:'0.5px', color:'rgba(255,255,255,0.35)',
          alignSelf:'center',
        }}>Cancel</motion.button>
    </motion.div>
  )
}

/* ── Step 2/3: Device found ──────────────────────── */
function DeviceFound({ device, onPair, onCancel }) {
  const isRipper = device === 'ripper'
  const name = isRipper ? 'Relentless Ripper™ Pro' : 'TANK M1'
  const sub  = isRipper ? 'Functional Trainer' : 'All Surface Sled'
  const img  = isRipper ? anotherTank : tankImg

  return (
    <motion.div key={`found-${device}`}
      initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }}
      exit={{ opacity:0, scale:0.94 }} transition={PAGE}
      style={{ position:'absolute', inset:0,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'0 24px' }}>

      <motion.img src={img}
        initial={{ y:24, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ delay:0.08, type:'spring', stiffness:280, damping:24 }}
        style={{ width:160, height:160, objectFit:'contain', marginBottom:20 }} alt={name}/>

      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.16 }} style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:8 }}>
          <motion.div animate={{ scale:[1,1.2,1] }}
            transition={{ repeat:Infinity, duration:1.8 }}
            style={{ width:10, height:10, borderRadius:'50%', background:'#2ECC71' }}/>
          <span style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
            color:'#2ECC71', textTransform:'uppercase', letterSpacing:'0.08em' }}>Found</span>
        </div>
        <div style={{ fontFamily:'Teko,sans-serif', fontSize:32, fontWeight:400,
          color:'#fff', textTransform:'uppercase', letterSpacing:'0.04em',
          lineHeight:'34px', marginBottom:6 }}>{name}</div>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
          color:'rgba(255,255,255,0.45)' }}>{sub}</div>
      </motion.div>

      <motion.button onClick={onPair} whileTap={{ scale:0.97 }}
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.24 }}
        style={{ width:'100%', height:44, borderRadius:6,
          background:'#F04E23', border:'none',
          fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
          letterSpacing:'1.1px', color:'#fff', cursor:'pointer', marginBottom:10 }}>
        PAIR
      </motion.button>
      <motion.button onClick={onCancel} whileTap={{ scale:0.97 }}
        style={{ width:'100%', height:44, borderRadius:6,
          background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
          fontFamily:'Teko,sans-serif', fontSize:22, fontWeight:400,
          letterSpacing:'0.8px', color:'rgba(255,255,255,0.4)', cursor:'pointer' }}>
        Cancel
      </motion.button>
    </motion.div>
  )
}

/* ── Step 4: Connected ───────────────────────────── */
function Connected({ device, onStart }) {
  const isRipper = device === 'ripper'
  const name = isRipper ? 'Relentless Ripper™ Pro' : 'TANK M1'

  return (
    <motion.div key="connected"
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-20 }} transition={PAGE}
      style={{ position:'absolute', inset:0,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'0 24px' }}>

      <motion.div
        initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ delay:0.08, type:'spring', stiffness:360, damping:22 }}
        style={{ width:96, height:96, borderRadius:'50%',
          background:'rgba(46,204,113,0.12)', border:'2px solid rgba(46,204,113,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24 }}>
        <svg width="44" height="44" viewBox="0 0 44 44">
          <motion.path d="M10 22L19 31L34 13" fill="none" stroke="#2ECC71"
            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength:0 }} animate={{ pathLength:1 }}
            transition={{ delay:0.28, duration:0.5, ease:'easeOut' }}/>
        </svg>
      </motion.div>

      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.22 }} style={{ textAlign:'center', marginBottom:36 }}>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
          color:'#2ECC71', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>
          Connected
        </div>
        <div style={{ fontFamily:'Teko,sans-serif', fontSize:34, fontWeight:400,
          color:'#fff', textTransform:'uppercase', letterSpacing:'0.04em', lineHeight:'36px' }}>
          {name}
        </div>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
          color:'rgba(255,255,255,0.4)', marginTop:6 }}>Ready to record</div>
      </motion.div>

      <motion.button onClick={onStart} whileTap={{ scale:0.97 }}
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.38 }}
        style={{ width:'100%', height:44, borderRadius:6,
          background:'#F04E23', border:'none',
          fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
          letterSpacing:'1.1px', color:'#fff', cursor:'pointer' }}>
        START SESSION
      </motion.button>
    </motion.div>
  )
}

/* ── Main NFCFlow ────────────────────────────────── */
export default function NFCFlow({ onConnected, onBack }) {
  const [step,   setStep]   = useState(0)
  const [device, setDevice] = useState('tank')

  // Auto-advance: connecting → found after 2.5s
  useEffect(() => {
    if (step !== 1) return
    const t = setTimeout(() => setStep(2), 2500)
    return () => clearTimeout(t)
  }, [step])

  return (
    <div style={{
      width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#1C1D21 0%,#0E0E0F 100%)',
      overflow:'hidden',
    }}>
      <StatusBar/>

      <div style={{ position:'absolute', top:'var(--status-h, 54px)', left:0, right:0, bottom:34, overflow:'hidden' }}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <TapToConnect key="tap"
              onTap={() => setStep(1)}
              onCantFind={() => setStep(1)}
              onBack={onBack}/>
          )}
          {step === 1 && (
            <ConnectingScreen key="connecting" onCancel={() => setStep(0)}/>
          )}
          {step === 2 && (
            <DeviceFound key="tank" device="tank"
              onPair={() => { setDevice('tank'); setStep(4) }}
              onCancel={() => setStep(0)}/>
          )}
          {step === 3 && (
            <DeviceFound key="ripper" device="ripper"
              onPair={() => { setDevice('ripper'); setStep(4) }}
              onCancel={() => setStep(0)}/>
          )}
          {step === 4 && (
            <Connected key="connected" device={device}
              onStart={() => onConnected && onConnected(device === 'ripper' ? 'Relentless Ripper™ Pro' : 'TANK M1')}/>
          )}
        </AnimatePresence>
      </div>

      {/* Demo switcher on found screens */}
      {(step === 2 || step === 3) && (
        <div style={{ position:'absolute', top:64, right:16, display:'flex', gap:6, zIndex:20 }}>
          {['tank','ripper'].map(d => (
            <motion.button key={d} onClick={() => setStep(d==='tank'?2:3)}
              whileTap={{ scale:0.92 }}
              style={{ padding:'3px 10px', borderRadius:6, cursor:'pointer',
                background: device===d ? 'rgba(240,78,35,0.15)' : 'rgba(255,255,255,0.05)',
                border: device===d ? '1px solid rgba(240,78,35,0.4)' : '1px solid rgba(255,255,255,0.1)',
                fontFamily:'Inter,sans-serif', fontSize:11,
                color: device===d ? '#F04E23' : 'rgba(255,255,255,0.4)' }}>
              {d}
            </motion.button>
          ))}
        </div>
      )}

      <HomeIndicator/>
    </div>
  )
}
