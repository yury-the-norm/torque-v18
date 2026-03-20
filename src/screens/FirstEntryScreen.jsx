import React from 'react'
import { motion } from 'framer-motion'
import StatusBar from '../components/StatusBar.jsx'
import NavBar from '../components/NavBar.jsx'
import tutorialImg from '../assets/tutorial_connect.png'

/* Tutorial card matches Figma:
   w=370 h=140 r=8 bg=#2D7FF9
   Left: text column (heading 26px Teko + desc 15px Inter + Watch button 65×32)
   Right: tutorial image 140×140 (overflows card top, positioned absolute)

   From the reference image provided:
   - "SHORT TUTORIAL" Teko bold-looking uppercase heading
   - "How to connect to equipment." subtitle Inter
   - [Watch] button — white outlined, bottom left
   - Phone+NFC image fills right side, extends beyond card top
*/

export default function FirstEntryScreen({ onStartWorkout, activeTab, onTabChange }) {
  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)' }}>
      <StatusBar/>

      <div className="scroll" style={{
        position:'absolute', top:54, left:0, right:0, bottom:90, overflowY:'auto' }}>
        <div style={{ padding:'8px 16px 8px', display:'flex', flexDirection:'column', gap:16 }}>

          {/* Title */}
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
            style={{ fontFamily:'Teko,sans-serif', fontSize:32, fontWeight:400,
              color:'#F04E23', lineHeight:'36px' }}>
            this is torque lifestyle
          </motion.div>

          {/* Journal empty state */}
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.08}}
            style={{ width:370, borderRadius:8, background:'#1C1D21', padding:16,
              display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ fontFamily:'Teko,sans-serif', fontSize:26, fontWeight:400,
              color:'#fff', lineHeight:'30px' }}>My Journal</div>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:300,
              color:'rgba(255,255,255,0.55)', lineHeight:'20px' }}>
              No sessions yet. Connect to a machine and start moving to record your first workout.
            </div>
          </motion.div>

          {/* ── SHORT TUTORIAL card ──────────────────────────────
              Figma: w=370 h=140 bg=#2D7FF9 r=8
              Image 140×140 positioned at right edge, vertically centered
              Text+button on left
          ─────────────────────────────────────────────────────── */}
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.14}}
            style={{
              width:370, height:140, borderRadius:8,
              background:'#2D7FF9',
              position:'relative', overflow:'hidden',
              flexShrink:0,
            }}>

            {/* Text column */}
            <div style={{ position:'absolute', top:16, left:16, right:156, bottom:16,
              display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div>
                {/* "SHORT TUTORIAL" — matches image: Teko uppercase */}
                <div style={{ fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
                  color:'#fff', textTransform:'uppercase', letterSpacing:'0.06em',
                  lineHeight:'26px', marginBottom:4 }}>Short Tutorial</div>
                {/* Subtitle */}
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:300,
                  color:'rgba(255,255,255,0.85)', lineHeight:'18px' }}>
                  How to connect to equipment.
                </div>
              </div>

              {/* Watch button — white outlined, bottom left, matches reference image */}
              <motion.button
                whileHover={{ background:'rgba(255,255,255,0.15)' }}
                whileTap={{ scale:0.94 }}
                style={{
                  alignSelf:'flex-start',
                  height:32, borderRadius:6, padding:'0 16px',
                  background:'transparent',
                  border:'1.5px solid rgba(255,255,255,0.8)',
                  fontFamily:'Teko,sans-serif', fontSize:20, fontWeight:500,
                  color:'#fff', cursor:'pointer',
                  letterSpacing:'0.5px',
                  transition:'background 0.15s',
                }}>
                Watch
              </motion.button>
            </div>

            {/* Tutorial image — right side, slight overflow top to feel dynamic */}
            <img src={tutorialImg}
              style={{
                position:'absolute', right:-4, top:-10,
                width:152, height:160,
                objectFit:'contain', objectPosition:'right center',
              }} alt="tutorial"/>
          </motion.div>

          {/* Explore exercises */}
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            style={{ width:370, borderRadius:8, background:'#1C1D21', padding:16,
              display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'Teko,sans-serif', fontSize:26, fontWeight:400,
                color:'#fff', lineHeight:'30px', marginBottom:4 }}>Explore exercises</div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:300,
                color:'rgba(255,255,255,0.55)', lineHeight:'20px' }}>
                See how to train with Torque equipment.
              </div>
            </div>
            <motion.button onClick={() => onTabChange('knowledge')}
              whileHover={{ background:'rgba(240,78,35,0.25)' }}
              whileTap={{ scale:0.95 }}
              style={{ height:32, borderRadius:6, padding:'0 12px',
                background:'rgba(240,78,35,0.15)',
                border:'1px solid rgba(240,78,35,0.3)',
                fontFamily:'Teko,sans-serif', fontSize:20, fontWeight:500,
                color:'#F04E23', cursor:'pointer', flexShrink:0, whiteSpace:'nowrap',
                transition:'background 0.15s' }}>
              View Library
            </motion.button>
          </motion.div>

          {/* Start Workout CTA */}
          <motion.button
            initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.26}}
            onClick={onStartWorkout}
            whileHover={{ scale:1.02, filter:'brightness(1.1)' }}
            whileTap={{ scale:0.97 }}
            style={{ width:370, height:44, borderRadius:6,
              background:'#F04E23', border:'none',
              fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
              letterSpacing:'1.1px', color:'#fff', cursor:'pointer' }}>
            START WORKOUT
          </motion.button>

          <div style={{height:8}}/>
        </div>
      </div>

      <NavBar active={activeTab} onChange={onTabChange}/>
    </div>
  )
}
