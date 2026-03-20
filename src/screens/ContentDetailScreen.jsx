import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, ChevronRight, Play } from 'lucide-react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import tankImg from '../assets/tank_m1.png'

export default function ContentDetailScreen({ content, onBack, onStart }) {
  const c = content || {
    title: 'Power Push Intervals',
    desc: 'Short bursts of maximum effort using the TANK sled. This workout develops explosive leg power, cardiovascular endurance, and full-body strength simultaneously.',
    dur: '10 min',
    level: 'Intermediate',
    levelColor: 'rgb(245,166,35)',
    equipment: 'Tank M1',
  }

  const steps = [
    { n:1, title:'Warm up', desc:'3 min light push at 40% effort', dur:'3 min' },
    { n:2, title:'Work interval', desc:'20 sec maximum effort sprint push', dur:'20 sec' },
    { n:3, title:'Rest interval', desc:'40 sec complete stop — catch your breath', dur:'40 sec' },
    { n:4, title:'Repeat', desc:'Complete 8 rounds of work/rest intervals', dur:'8× rounds' },
    { n:5, title:'Cool down', desc:'3 min slow push to bring heart rate down', dur:'3 min' },
  ]

  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)' }}>
      <StatusBar/>

      {/* Back */}
      <button onClick={onBack} className="pressable" style={{
        position:'absolute', top:62, left:16, zIndex:10,
        width:36, height:36, borderRadius:8,
        background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.1)',
        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
      }}>
        <ArrowLeft size={18} color="#fff"/>
      </button>

      <div className="scroll" style={{
        position:'absolute', top:54, left:0, right:0, bottom:88, overflowY:'auto' }}>

        {/* Hero */}
        <div style={{
          background:'#1C1D21', padding:'60px 16px 16px',
          display:'flex', gap:16, alignItems:'flex-end',
          borderBottom:'1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Teko,sans-serif', fontSize:32, fontWeight:400,
              color:'#fff', lineHeight:1.05, letterSpacing:'0.02em', marginBottom:6 }}>
              {c.title}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <Clock size={11} color="rgba(255,255,255,0.4)"/>
              <span style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
                color:'rgba(255,255,255,0.5)' }}>{c.dur}</span>
              <span style={{ color:'rgba(255,255,255,0.25)', fontSize:12 }}>•</span>
              <span style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
                color: c.levelColor || 'rgba(255,255,255,0.5)' }}>{c.level}</span>
              <span style={{ color:'rgba(255,255,255,0.25)', fontSize:12 }}>•</span>
              <span style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
                color:'rgba(255,255,255,0.5)' }}>{c.equipment}</span>
            </div>
          </div>
          <img src={tankImg} style={{ width:80, height:80, objectFit:'contain', flexShrink:0 }} alt="equipment"/>
        </div>

        <div style={{ padding:'16px 16px 24px', display:'flex', flexDirection:'column', gap:14 }}>

          {/* Description */}
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:300,
              color:'rgba(255,255,255,0.65)', lineHeight:1.6 }}>{c.desc}</div>
          </motion.div>

          {/* Steps */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.08}}>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:500,
              color:'rgba(255,255,255,0.5)', textTransform:'uppercase',
              letterSpacing:'0.08em', marginBottom:10 }}>Workout plan</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {steps.map((step, i) => (
                <div key={i} style={{
                  background:'#1C1D21', borderRadius:8, padding:'10px 12px',
                  display:'flex', alignItems:'center', gap:12,
                }}>
                  <div style={{
                    width:28, height:28, borderRadius:8, flexShrink:0,
                    background: i === 1 ? 'rgba(240,78,35,0.15)' : 'rgba(255,255,255,0.05)',
                    border: i === 1 ? '1px solid rgba(240,78,35,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'Space Mono,monospace', fontSize:11, fontWeight:700,
                    color: i === 1 ? '#F04E23' : 'rgba(255,255,255,0.4)',
                  }}>{step.n}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Teko,sans-serif', fontSize:18, fontWeight:400,
                      color:'#fff', lineHeight:1 }}>{step.title}</div>
                    <div style={{ fontFamily:'Inter,sans-serif', fontSize:11, fontWeight:300,
                      color:'rgba(255,255,255,0.45)', marginTop:2 }}>{step.desc}</div>
                  </div>
                  <span style={{ fontFamily:'Space Mono,monospace', fontSize:11, fontWeight:400,
                    color:'rgba(255,255,255,0.3)', flexShrink:0 }}>{step.dur}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        position:'absolute', bottom:34, left:0, right:0,
        padding:'12px 16px',
        background:'rgba(14,14,15,0.95)',
        backdropFilter:'blur(12px)',
        borderTop:'1px solid rgba(255,255,255,0.06)',
      }}>
        <button onClick={onStart} className="pressable" style={{
          width:'100%', height:44, borderRadius:6,
          background:'#F04E23', border:'none',
          fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
          letterSpacing:'1.1px', color:'#fff', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        }}>
          <Play size={16} fill="#fff"/> Start guided workout
        </button>
      </div>
      <HomeIndicator/>
    </div>
  )
}
