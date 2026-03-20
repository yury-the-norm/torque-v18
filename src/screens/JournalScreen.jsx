import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StatusBar from '../components/StatusBar.jsx'
import NavBar from '../components/NavBar.jsx'
import FigmaChart from '../components/FigmaChart.jsx'
import ProgressMetricRow from '../components/ProgressMetricRow.jsx'
import tankImg from '../assets/tank_m1.png'

const FILTERS = ['Week', 'Month', 'Year', 'Equipment']

const WEEK_DATA = [
  {d:'SU',v:0},{d:'MO',v:420},{d:'TU',v:550},{d:'WE',v:480},
  {d:'TH',v:712},{d:'FR',v:630},{d:'SA',v:0},
]
const MONTH_DATA = Array.from({length:30}, (_,i) => ({
  d:i+1, v:280 + Math.sin(i*0.5)*160 + (i%7)*20,
}))
const YEAR_DATA = [
  {d:'Jan',v:320},{d:'Feb',v:380},{d:'Mar',v:410},{d:'Apr',v:450},
  {d:'May',v:490},{d:'Jun',v:530},{d:'Jul',v:560},{d:'Aug',v:600},
  {d:'Sep',v:580},{d:'Oct',v:620},{d:'Nov',v:650},{d:'Dec',v:712},
]

const WORKOUTS = [
  { date:'Apr 12', dur:'32:42', title:'Tank M1 + Relentless Ripper™ Pro',
    forceVal:'711 N', forceBar:220, distVal:'42 m', distBar:168, showImg:true },
  { date:'Apr 10', dur:'02:15', title:'Tank M3',
    forceVal:'560 N', forceBar:340, distVal:'18 m', distBar:268, showImg:false },
]

export default function JournalScreen({ onStartWorkout, onOpenDetail, activeTab, onTabChange }) {
  const [filter, setFilter] = useState('Week')
  const chartData = filter==='Week' ? WEEK_DATA : filter==='Month' ? MONTH_DATA : YEAR_DATA
  const chartLabels = filter==='Week' ? ['SU','MO','Tu','WE','Th','FR','Sa']
    : filter==='Year' ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    : null

  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)' }}>
      <StatusBar/>
      <div className="scroll" style={{
        position:'absolute', top:54, left:0, right:0, bottom:90, overflowY:'auto' }}>
        <div style={{ padding:'8px 16px 8px', display:'flex', flexDirection:'column', gap:16 }}>

          {/* Title: Teko 32px #F04E23 */}
          <div style={{ fontFamily:'Teko,sans-serif', fontSize:32, fontWeight:400,
            color:'#F04E23', lineHeight:'36px' }}>My Journal</div>

          {/* Chart card: w=370 r=8 bg=#1C1D21 p l=8 r=8 t=16 b=16 gap=16 */}
          <div style={{ width:370, borderRadius:8, background:'#1C1D21',
            padding:'16px 8px', display:'flex', flexDirection:'column', gap:16 }}>

            {/* Header row: title + filter tabs */}
            <div style={{ width:354, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
                color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                Progress Peak Force
              </span>
              {/* Tabs: w=165 h=40 r=8 bg dark p=4 gap=2 */}
              <div style={{ width:165, height:40, borderRadius:8, background:'rgba(0,0,0,0.5)',
                padding:4, display:'flex', gap:2 }}>
                {FILTERS.map(f => {
                  const a = filter===f
                  return (
                    <motion.button key={f} onClick={() => setFilter(f)}
                      whileHover={{ color: a ? '#fff' : 'rgba(255,255,255,0.7)' }}
                      whileTap={{ scale: 0.93 }}
                      style={{
                        flex:1, height:32, borderRadius:6,
                        background: a ? 'rgba(255,255,255,0.10)' : 'transparent',
                        border:'none', cursor:'pointer',
                        fontFamily:'Inter,sans-serif', fontSize:10, fontWeight: a ? 700 : 400,
                        color: a ? '#fff' : 'rgba(255,255,255,0.4)',
                        transition: 'background 0.15s, color 0.15s',
                      }}>{f}</motion.button>
                  )
                })}
              </div>
            </div>

            {/* Chart: Figma w=354 h=160 */}
            <AnimatePresence mode="wait">
              <motion.div key={filter}
                initial={{opacity:0, x:16}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-16}}
                transition={{duration:0.3, ease:[0.32,0.72,0,1]}}>
                <FigmaChart data={chartData} width={354} height={160} labels={chartLabels}/>
              </motion.div>
            </AnimatePresence>

            {/* KPI row: Space Mono 24px, Inter 11px fw=300 labels */}
            <div style={{ paddingLeft:8, paddingRight:8, paddingTop:8, display:'flex', gap:16 }}>
              {[{l:'workouts',v:'28'},{l:'Best Force',v:'712 N'},{l:'total Dist.',v:'435 M'}].map(({l,v}) => (
                <div key={l} style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:11, fontWeight:300,
                    color:'rgba(255,255,255,0.45)' }}>{l}</span>
                  <span style={{ fontFamily:'Space Mono,monospace', fontSize:24, fontWeight:400,
                    color:'#fff', lineHeight:1 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* START WORKOUT btn: w=370 h=44 r=6 #F04E23 Teko 500 24px */}
          <motion.button onClick={onStartWorkout}
            whileHover={{ scale:1.02, filter:'brightness(1.1)' }}
            whileTap={{ scale:0.97 }}
            style={{
              width:370, height:44, borderRadius:6, background:'#F04E23', border:'none',
              fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
              letterSpacing:'1.1px', color:'#fff', cursor:'pointer', textTransform:'uppercase' }}>
            START WORKOUT
          </motion.button>

          {/* Section title */}
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:20, fontWeight:400, color:'#fff' }}>
            Recent workouts
          </div>

          {/* Workout cards */}
          {WORKOUTS.map((w, i) => (
            <motion.div key={i}
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              whileHover={{ scale:1.01, borderColor:'rgba(255,255,255,0.14)' }}
              whileTap={{ scale:0.98 }}
              style={{ width:370, borderRadius:8, background:'#1C1D21',
                padding:8, display:'flex', flexDirection:'column', gap:8,
                cursor:'pointer', border:'1px solid rgba(255,255,255,0.06)' }}
              onClick={() => onOpenDetail && onOpenDetail(w)}>
              {/* Date + duration */}
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
                  color:'rgba(255,255,255,0.55)' }}>{w.date}</span>
                <span style={{ fontFamily:'Space Mono,monospace', fontSize:13, fontWeight:400,
                  color:'rgba(255,255,255,0.55)' }}>{w.dur}</span>
              </div>
              {/* Content row */}
              <div style={{ display:'flex', alignItems:'flex-start' }}>
                <div style={{ flex:1 }}>
                  {/* Title: Teko 26px */}
                  <div style={{ fontFamily:'Teko,sans-serif', fontSize:26, fontWeight:400,
                    color:'#fff', lineHeight:'30px', marginBottom:8 }}>{w.title}</div>
                  {/* Progress bars */}
                  <ProgressMetricRow label="MaX Force" value={w.forceVal}
                    barWidth={w.forceBar} barColor="#F04E23"/>
                  <div style={{height:8}}/>
                  <ProgressMetricRow label="Total Distance" value={w.distVal}
                    barWidth={w.distBar} barColor="rgb(105,108,120)"/>
                </div>
                {/* Tank image: Figma w=90 h=90, shown only for first card */}
                {w.showImg && (
                  <img src={tankImg} style={{
                    width:90, height:90, objectFit:'contain', flexShrink:0, marginLeft:8 }}
                    alt="Tank M1"/>
                )}
              </div>
            </motion.div>
          ))}
          <div style={{height:8}}/>
        </div>
      </div>
      <NavBar active={activeTab} onChange={onTabChange}/>
    </div>
  )
}
