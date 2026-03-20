import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import nfcIcon from '../assets/bottom_menu_icon.png'
import tankImg from '../assets/tank_m1.png'
import anotherTank from '../assets/another_tank.png'

/*
 Figma NFC Pairing (262:6286) — exact layout:
   NFC Container: x=16 y=8 w=370 h=300
     nfc 1 icon: x=153 y=64 w=64 h=64
       → center in container: x=153+32=185 from left of container
       → absolute from screen left: 16+153=169, center=169+32=201 = screen center ✓
   Ellipse 1: x=-248 y=-250 w=898 h=509
     radial gradient fill: blue(#2D7FF9) → white, opacity=0.8
     This is purely decorative background glow, NOT animated rings

   "Tap to connect": Teko, y=144 inside NFC container → absolute y = 8+144 = 152 from content top
   Subtitle: y=196
   "Bluetooth will activate…": absolute y=340 (outside NFC container)
   "Can't find NFC tag?" button: absolute y=392
   "Back" button: absolute y=780
*/

const PAGE = { duration: 0.26, ease: [0.32, 0.72, 0, 1] }

/* ─── NFC Tap-to-connect screen ─────────────────────── */
function TapToConnect({ onTap, onCantFind, onBack }) {
  return (
    <motion.div key="tap"
      initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:-40 }} transition={PAGE}
      style={{ position:'absolute', inset:0 }}>

      {/* NFC Container: y=8 h=300, icon at y=64 inside */}
      <motion.div
        onClick={onTap}
        whileTap={{ scale: 0.97 }}
        style={{
          position: 'absolute',
          top: 8, left: 16, right: 16, height: 300,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 1,
        }}
      >
        {/* Pulsing rounded squares — grow from icon center, r=16 matching FAB */}
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            animate={{
              width:  [64, 180],
              height: [64, 180],
              opacity: [0.55, 0],
              borderRadius: [16, 40],
              x: [0, -(180-64)/2],
              y: [0, -(180-64)/2],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              delay: i * 0.68,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              top: 64,
              left: '50%',
              marginLeft: -32, /* half of 64 — initial center */
              width: 64, height: 64,
              borderRadius: 16,
              border: '1.5px solid #2D7FF9',
              background: 'transparent',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* NFC icon — 64×64 r=16 on top of rings */}
        <div style={{
          position: 'absolute',
          top: 64,
          left: '50%', transform: 'translateX(-50%)',
          width: 64, height: 64,
          borderRadius: 16,
          background: 'rgba(45,127,249,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}>
          <img src={nfcIcon}
            style={{ width: 36, height: 36, opacity: 0.9, display: 'block' }}
            alt="NFC"/>
        </div>

        {/* "Tap to connect" text: Figma y=144 inside NFC container */}
        <div style={{
          position: 'absolute', top: 144, left: 0, right: 0,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'Teko, sans-serif', fontSize: 36, fontWeight: 500,
            color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em',
            lineHeight: '40px', marginBottom: 14,
          }}>Tap to connect</div>

          {/* Subtitle: y=196 */}
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 300,
            color: 'rgba(255,255,255,0.55)', lineHeight: '22px',
          }}>
            Find the NFC mark on the equipment<br/>
            and tap your phone to connect.
          </div>
        </div>
      </motion.div>

      {/* "Bluetooth will activate automatically." — y=340 absolute */}
      <div style={{
        position: 'absolute', top: 340, left: 0, right: 0,
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 300,
        color: 'rgba(255,255,255,0.35)',
        zIndex: 1,
      }}>Bluetooth will activate automatically.</div>

      {/* "Can't find the NFC tag?" — y=392 */}
      <motion.button
        onClick={onCantFind}
        whileTap={{ scale: 0.96 }}
        style={{
          position: 'absolute', top: 392, left: 0, right: 0,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 300,
          color: 'rgba(255,255,255,0.4)',
          textDecoration: 'underline',
          zIndex: 1,
        }}>Can't find the NFC tag?</motion.button>

      {/* Back — y=780 → bottom:50 */}
      <motion.button
        onClick={onBack}
        whileTap={{ scale: 0.96 }}
        style={{
          position: 'absolute', bottom: 50, left: 0, right: 0,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'Teko, sans-serif', fontSize: 24, fontWeight: 400,
          letterSpacing: '0.5px', color: 'rgba(255,255,255,0.35)',
          zIndex: 1,
        }}>Back</motion.button>
    </motion.div>
  )
}

/* ─── Step 1: BT Scanning ─────────────────────────────── */
function BTScanning({ onCancel }) {
  return (
    <motion.div key="scanning"
      initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:-40 }} transition={PAGE}
      style={{ position:'absolute', inset:0,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'0 24px' }}>

      {/* Same glow behind */}
      <div style={{
        position:'absolute', left:-248, top:-196,
        width:898, height:509, borderRadius:'50%',
        background:'radial-gradient(circle at 55% 55%, rgba(45,127,249,0.45) 0%, rgba(45,127,249,0.12) 45%, transparent 70%)',
        pointerEvents:'none',
      }}/>

      {/* Icon */}
      <div style={{ width:64, height:64, borderRadius:16,
        background:'rgba(45,127,249,0.15)',
        display:'flex', alignItems:'center', justifyContent:'center',
        marginBottom:32, position:'relative', zIndex:1 }}>
        <img src={nfcIcon} style={{ width:36, height:36, opacity:0.9 }} alt="NFC"/>
      </div>

      <motion.div animate={{ opacity:[1,0.4,1] }}
        transition={{ repeat:Infinity, duration:1.6 }}
        style={{ fontFamily:'Teko,sans-serif', fontSize:28, fontWeight:400,
          color:'#fff', textTransform:'uppercase', letterSpacing:'0.04em',
          marginBottom:8, zIndex:1, position:'relative' }}>
        Scanning…
      </motion.div>
      <div style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
        color:'rgba(255,255,255,0.45)', textAlign:'center', lineHeight:1.6,
        marginBottom:8, zIndex:1, position:'relative' }}>
        Keep your phone close to the console
      </div>
      <div style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
        color:'rgba(45,127,249,0.8)', marginBottom:48, zIndex:1, position:'relative' }}>
        Got it
      </div>

      <motion.button onClick={onCancel} whileTap={{ scale:0.96 }}
        style={{ background:'none', border:'none', cursor:'pointer',
          fontFamily:'Teko,sans-serif', fontSize:22, fontWeight:400,
          letterSpacing:'0.5px', color:'rgba(255,255,255,0.35)',
          zIndex:1, position:'relative' }}>Cancel</motion.button>
    </motion.div>
  )
}

/* ─── Step 2/3: Device found ──────────────────────────── */
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
        transition={{ delay:0.16 }}
        style={{ textAlign:'center', marginBottom:32 }}>
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

      <motion.button onClick={onPair}
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.24 }}
        whileTap={{ scale:0.97 }}
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

/* ─── Step 4: Connected ───────────────────────────────── */
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

      <motion.button onClick={onStart}
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.38 }}
        whileTap={{ scale:0.97 }}
        style={{ width:'100%', height:44, borderRadius:6,
          background:'#F04E23', border:'none',
          fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
          letterSpacing:'1.1px', color:'#fff', cursor:'pointer' }}>
        START SESSION
      </motion.button>
    </motion.div>
  )
}

/* ─── Main ────────────────────────────────────────────── */
export default function NFCFlow({ onConnected, onBack }) {
  const [step,   setStep]   = useState(0)
  const [device, setDevice] = useState('tank')

  useEffect(() => {
    if (step !== 1) return
    const t = setTimeout(() => setStep(2), 2200)
    return () => clearTimeout(t)
  }, [step])

  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)',
      overflow:'hidden' }}>
      <StatusBar/>

      <div style={{ position:'absolute', top:54, left:0, right:0, bottom:34, overflow:'hidden' }}>
        <AnimatePresence mode="wait">
          {step === 0 && <TapToConnect key="tap"
            onTap={() => setStep(1)} onCantFind={() => setStep(1)} onBack={onBack}/>}
          {step === 1 && <BTScanning key="scanning" onCancel={() => setStep(0)}/>}
          {step === 2 && <DeviceFound key="tank" device="tank"
            onPair={() => { setDevice('tank'); setStep(4); }} onCancel={() => setStep(0)}/>}
          {step === 3 && <DeviceFound key="ripper" device="ripper"
            onPair={() => { setDevice('ripper'); setStep(4); }} onCancel={() => setStep(0)}/>}
          {step === 4 && <Connected key="connected" device={device}
            onStart={() => onConnected && onConnected(device === 'ripper' ? 'Relentless Ripper™ Pro' : 'TANK M1')}/>}
        </AnimatePresence>
      </div>

      {/* Demo switcher */}
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
