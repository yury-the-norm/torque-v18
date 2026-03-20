import React from 'react'
import { motion } from 'framer-motion'
import { Share2, ArrowRight, Zap, Ruler, Clock } from 'lucide-react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import ProgressMetricRow from '../components/ProgressMetricRow.jsx'

export default function WorkoutSummaryScreen({ onSignup, onExit }) {
  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)' }}>
      <StatusBar/>

      <div className="scroll" style={{
        position:'absolute', top:54, left:0, right:0, bottom:34, overflowY:'auto' }}>
        <div style={{ padding:'16px 16px 24px', display:'flex', flexDirection:'column', gap:14 }}>

          {/* Header */}
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
            <div style={{ fontFamily:'Teko,sans-serif', fontSize:32, fontWeight:400,
              color:'#F04E23', lineHeight:'36px', textTransform:'uppercase' }}>
              Session complete
            </div>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
              color:'rgba(255,255,255,0.4)', marginTop:4 }}>Tank M1 · Apr 12 · 32:42</div>
          </motion.div>

          {/* Big KPI row */}
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
            style={{ display:'flex', gap:8 }}>
            {[
              {icon:Zap,   label:'Max Force',  value:'711 N',  color:'#F04E23'},
              {icon:Ruler, label:'Distance',   value:'42 m',   color:'#2D7FF9'},
              {icon:Clock, label:'Duration',   value:'32:42',  color:'rgba(255,255,255,0.7)'},
            ].map(({icon:Icon, label, value, color}, i) => (
              <div key={i} style={{
                flex:1, background:'#1C1D21', borderRadius:8, padding:'12px 10px',
                display:'flex', flexDirection:'column', gap:4,
              }}>
                <Icon size={12} color={color}/>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:20, fontWeight:400,
                  color, lineHeight:1, marginTop:2 }}>{value}</div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:10, fontWeight:300,
                  color:'rgba(255,255,255,0.4)', textTransform:'uppercase',
                  letterSpacing:'0.06em' }}>{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Progress bars */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
            style={{ background:'#1C1D21', borderRadius:8, padding:8,
              display:'flex', flexDirection:'column', gap:8 }}>
            <ProgressMetricRow label="MaX Force" value="711 N" barWidth={340} barColor="#F04E23"/>
            <ProgressMetricRow label="Total Distance" value="42 m" barWidth={280} barColor="rgb(105,108,120)"/>
          </motion.div>

          {/* Share button */}
          <motion.button initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            className="pressable"
            style={{
              width:'100%', height:44, borderRadius:6,
              background:'rgba(255,255,255,0.07)',
              border:'1px solid rgba(255,255,255,0.12)',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              fontFamily:'Teko,sans-serif', fontSize:22, fontWeight:500,
              letterSpacing:'1px', color:'rgba(255,255,255,0.7)', cursor:'pointer',
            }}>
            <Share2 size={16}/> Share results
          </motion.button>

          {/* Create account CTA */}
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.28}}
            style={{
              background:'rgba(240,78,35,0.08)',
              border:'1px solid rgba(240,78,35,0.25)',
              borderRadius:12, padding:16,
            }}>
            <div style={{ fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:400,
              color:'#fff', letterSpacing:'0.02em', marginBottom:6 }}>
              Save your progress
            </div>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
              color:'rgba(255,255,255,0.55)', lineHeight:1.5, marginBottom:14 }}>
              Create a free account to track your workouts, monitor improvements over time, and sync with Apple Health.
            </div>
            <button onClick={onSignup} className="pressable" style={{
              width:'100%', height:44, borderRadius:6,
              background:'#F04E23', border:'none',
              fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
              letterSpacing:'1.1px', color:'#fff', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}>
              Create account <ArrowRight size={18}/>
            </button>
          </motion.div>

          {/* Exit */}
          <button onClick={onExit} className="pressable" style={{
            background:'none', border:'none', cursor:'pointer',
            fontFamily:'Teko,sans-serif', fontSize:20, fontWeight:400,
            letterSpacing:'1px', color:'rgba(255,255,255,0.3)',
            textAlign:'center', padding:'4px',
          }}>
            Exit without saving
          </button>

        </div>
      </div>
      <HomeIndicator/>
    </div>
  )
}
