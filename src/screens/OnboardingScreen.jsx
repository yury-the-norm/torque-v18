import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'

const STEPS = [
  {
    id: 'welcome',
    icon: '👋',
    title: 'Welcome to Torque Connect',
    desc: 'Track force, distance, energy and heart rate across every workout. Connect to any Torque device with one tap.',
    cta: 'Get started',
  },
  {
    id: 'bluetooth',
    icon: null,
    svgIcon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 6L36 18L28 26L36 34L24 42V26L16 34L24 26L16 18L24 6Z"
          stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    title: 'Enable Bluetooth',
    desc: 'Torque Connect uses Bluetooth to communicate with your equipment and record live performance data.',
    cta: 'Enable Bluetooth',
    sub: 'Skip for now',
  },
  {
    id: 'health',
    icon: null,
    svgIcon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 40C24 40 8 30 8 18C8 13.58 11.58 10 16 10C19.04 10 21.72 11.64 24 14C26.28 11.64 28.96 10 32 10C36.42 10 40 13.58 40 18C40 30 24 40 24 40Z"
          stroke="#ef4444" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Connect Apple Health',
    desc: 'Sync your workout data with Apple Health so all your fitness metrics live in one place.',
    cta: 'Connect Apple Health',
    sub: 'Skip for now',
  },
]

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0)
  const s = STEPS[step]
  const isLast = step === STEPS.length - 1

  function next() {
    if (isLast) { onComplete && onComplete(); return; }
    setStep(s => s + 1)
  }

  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)',
      display:'flex', flexDirection:'column' }}>
      <StatusBar/>

      {/* Step dots */}
      <div style={{
        position:'absolute', top:62, left:0, right:0,
        display:'flex', justifyContent:'center', gap:6,
      }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 20 : 6, height:6,
            borderRadius:3, transition:'all 0.3s',
            background: i === step ? '#F04E23' : 'rgba(255,255,255,0.2)',
          }}/>
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'80px 32px 0', textAlign:'center',
      }}>
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{opacity:0, x:40}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-40}}
            transition={{duration:0.28}}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:24 }}>

            {/* Icon */}
            <div style={{
              width:96, height:96, borderRadius:28,
              background:'rgba(255,255,255,0.05)',
              border:'1px solid rgba(255,255,255,0.1)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:48,
            }}>
              {s.icon ? s.icon : s.svgIcon}
            </div>

            {/* Text */}
            <div>
              <div style={{ fontFamily:'Teko,sans-serif', fontSize:34, fontWeight:400,
                color:'#fff', textTransform:'uppercase', letterSpacing:'0.04em',
                lineHeight:1.1, marginBottom:12 }}>{s.title}</div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:300,
                color:'rgba(255,255,255,0.55)', lineHeight:1.6 }}>{s.desc}</div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTAs */}
      <div style={{ padding:'0 24px 40px', display:'flex', flexDirection:'column', gap:10 }}>
        <button onClick={next} className="pressable" style={{
          width:'100%', height:44, borderRadius:6,
          background:'#F04E23', border:'none',
          fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
          letterSpacing:'1.1px', color:'#fff', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        }}>
          {s.cta} {isLast ? '' : <ArrowRight size={18}/>}
        </button>
        {s.sub && (
          <button onClick={next} className="pressable" style={{
            background:'none', border:'none', cursor:'pointer',
            fontFamily:'Teko,sans-serif', fontSize:20, fontWeight:400,
            letterSpacing:'0.5px', color:'rgba(255,255,255,0.35)',
            textAlign:'center', padding:'8px',
          }}>{s.sub}</button>
        )}
      </div>

      <HomeIndicator/>
    </div>
  )
}
