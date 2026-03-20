import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Share2, Zap, Ruler, Flame, Heart, Clock } from 'lucide-react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import FigmaChart from '../components/FigmaChart.jsx'
import ProgressMetricRow from '../components/ProgressMetricRow.jsx'

const CHART_DATA = [
  {v:0},{v:120},{v:280},{v:420},{v:380},{v:520},{v:611},{v:580},{v:490},{v:560},{v:420},{v:380}
]
const LABELS = ['0:00','0:03','0:06','0:09','0:12','0:15','0:18','0:21','0:24','0:27','0:30','0:32']

export default function WorkoutDetailScreen({ workout, onBack }) {
  const w = workout || {
    date:'Apr 12', dur:'32:42',
    title:'Tank M1 + Relentless Ripper™ Pro',
    forceVal:'711 N', forceBar:340,
    distVal:'42 m', distBar:280,
  }

  const metrics = [
    { icon:Zap,   label:'Max Force',       value:'711 N',   color:'#F04E23' },
    { icon:Ruler, label:'Total Distance',  value:'42 m',    color:'#2D7FF9' },
    { icon:Flame, label:'Energy',          value:'8 240 J',  color:'#F04E23' },
    { icon:Heart, label:'Avg HR',          value:'118 bpm',  color:'#ef4444' },
    { icon:Clock, label:'Duration',        value:'32:42',    color:'rgba(255,255,255,0.7)' },
    { icon:Flame, label:'Calories',        value:'124 kcal', color:'#F04E23' },
  ]

  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)' }}>
      <StatusBar/>

      {/* Header */}
      <div style={{
        position:'absolute', top:54, left:0, right:0,
        height:60, display:'flex', alignItems:'center',
        padding:'0 16px', gap:12,
      }}>
        <button onClick={onBack} className="pressable" style={{
          width:36, height:36, borderRadius:8,
          background:'rgba(255,255,255,0.06)',
          border:'1px solid rgba(255,255,255,0.1)',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', flexShrink:0,
        }}>
          <ArrowLeft size={18} color="#fff"/>
        </button>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:'Teko,sans-serif', fontSize:22, fontWeight:400,
            color:'#fff', lineHeight:1, letterSpacing:'0.02em' }}>{w.title}</div>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
            color:'rgba(255,255,255,0.4)', marginTop:2 }}>{w.date} · {w.dur}</div>
        </div>
        <button className="pressable" style={{
          width:36, height:36, borderRadius:8,
          background:'rgba(255,255,255,0.06)',
          border:'1px solid rgba(255,255,255,0.1)',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', flexShrink:0,
        }}>
          <Share2 size={16} color="#fff"/>
        </button>
      </div>

      <div className="scroll" style={{
        position:'absolute', top:114, left:0, right:0, bottom:34, overflowY:'auto' }}>
        <div style={{ padding:'8px 16px 16px', display:'flex', flexDirection:'column', gap:12 }}>

          {/* Force chart */}
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            style={{ background:'#1C1D21', borderRadius:8, padding:'12px 8px 8px' }}>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:11, fontWeight:300,
              color:'rgba(255,255,255,0.4)', textTransform:'uppercase',
              letterSpacing:'0.08em', marginBottom:8, paddingLeft:4 }}>
              Force over time
            </div>
            <FigmaChart data={CHART_DATA} width={354} height={120} labels={LABELS}/>
          </motion.div>

          {/* Progress bars */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.07}}
            style={{ background:'#1C1D21', borderRadius:8, padding:8,
              display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ fontFamily:'Teko,sans-serif', fontSize:20, fontWeight:400,
              color:'rgba(255,255,255,0.5)', paddingBottom:4,
              borderBottom:'1px solid rgba(255,255,255,0.06)' }}>Tank PUSH</div>
            <ProgressMetricRow label="MaX Force" value={w.forceVal}
              barWidth={w.forceBar} barColor="#F04E23"/>
            <ProgressMetricRow label="Total Distance" value={w.distVal}
              barWidth={w.distBar} barColor="rgb(105,108,120)"/>
          </motion.div>

          {/* Metric grid */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.12}}
            style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {metrics.map(({ icon:Icon, label, value, color }, i) => (
              <div key={i} style={{
                background:'#1C1D21', borderRadius:8, padding:'12px',
                display:'flex', flexDirection:'column', gap:4,
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <Icon size={12} color={color}/>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:10, fontWeight:300,
                    color:'rgba(255,255,255,0.4)', textTransform:'uppercase',
                    letterSpacing:'0.06em' }}>{label}</span>
                </div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:20, fontWeight:400,
                  color, lineHeight:1 }}>{value}</div>
              </div>
            ))}
          </motion.div>

          {/* Share CTA */}
          <motion.button initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.18}}
            className="pressable"
            style={{
              width:'100%', height:44, borderRadius:6,
              background:'rgba(255,255,255,0.06)',
              border:'1px solid rgba(255,255,255,0.12)',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              fontFamily:'Teko,sans-serif', fontSize:22, fontWeight:500,
              letterSpacing:'1px', color:'rgba(255,255,255,0.7)', cursor:'pointer',
            }}>
            <Share2 size={16}/> Share workout
          </motion.button>

        </div>
      </div>
      <HomeIndicator/>
    </div>
  )
}
