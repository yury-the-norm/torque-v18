import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StatusBar from '../components/StatusBar.jsx'
import NavBar from '../components/NavBar.jsx'
import tankImg from '../assets/tank_m1.png'
import anotherTankImg from '../assets/another_tank.png'
import tutorialImg from '../assets/tutorial_connect.png'

const CHIPS = ['Featured', 'Exercise', 'Guides', 'Equipment']

const CARDS = [
  { title:'Power Push Intervals',
    desc:'Short bursts of maximum effort using the TANK sled.',
    dur:'10 min', level:'Intermediate', levelColor:'rgb(245,166,35)',
    img: tankImg, titleSize:26 },
  { title:'Full Body Conditioning',
    desc:'Combine sled pushes with bodyweight exercises.',
    dur:'20 min', level:'All levels', levelColor:'rgba(255,255,255,0.8)',
    img: anotherTankImg, titleSize:26 },
  { title:'Sprint Strength Builder',
    desc:'Develop explosive leg power and acceleration.',
    dur:'20 min', level:'Advanced', levelColor:'rgb(211,47,47)',
    img: tankImg, titleSize:32 },
]

export default function KnowledgeScreen({ onOpenContent, activeTab, onTabChange }) {
  const [chip, setChip] = useState('Featured')

  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)' }}>
      <StatusBar/>

      <div className="scroll" style={{
        position:'absolute', top:54, left:0, right:0, bottom:90, overflowY:'auto' }}>
        <div style={{ padding:'8px 16px 8px', display:'flex', flexDirection:'column', gap:16 }}>

          {/* Section Header: padding t=16 b=16 gap=4 */}
          <div style={{ paddingTop:16, paddingBottom:16,
            display:'flex', flexDirection:'column', gap:4 }}>
            {/* Teko 32px #F04E23 — from Figma */}
            <div style={{ fontFamily:'Teko,sans-serif', fontSize:32, fontWeight:400,
              color:'#F04E23', lineHeight:'36px' }}>Training Knowledge</div>
            {/* Inter 15px fw=300 */}
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:300,
              color:'rgba(255,255,255,0.8)', lineHeight:'20px' }}>
              Learn how to train with Torque equipment &amp; improve your performance.
            </div>
          </div>

          {/* Tutorial Section: w=370 h=140 r=8 bg=#2D7FF9 p=16 gap=16 */}
          <div style={{ width:370, borderRadius:8, background:'#2D7FF9',
            padding:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:4, flex:1 }}>
              {/* Teko 26px fw=400 */}
              <div style={{ fontFamily:'Teko,sans-serif', fontSize:26, fontWeight:400,
                color:'#fff', lineHeight:'30px' }}>Short tutorial</div>
              {/* Inter 15px fw=300 */}
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:300,
                color:'rgba(255,255,255,0.85)', lineHeight:'20px' }}>
                How to connect to equipment.
              </div>
            </div>
            {/* Tutorial image 90×90 */}
            <img src={tutorialImg} style={{ width:90, height:90, objectFit:'contain',
              borderRadius:8, flexShrink:0, marginLeft:12 }} alt="tutorial"/>
            {/* Watch btn: Figma w=65 h=32 r=6 bg=white Teko Medium 20px color=#2D7FF9 */}
            <button className="pressable" style={{
              width:65, height:32, borderRadius:6, background:'#fff', border:'none',
              fontFamily:'Teko,sans-serif', fontSize:20, fontWeight:500,
              color:'#2D7FF9', cursor:'pointer', flexShrink:0, marginLeft:8 }}>
              Watch
            </button>
          </div>

          {/* Tabs: w=379 h=40 r=8 bg=#1C1D21 p=4 gap=2 */}
          <div style={{ width:379, height:40, borderRadius:8, background:'#1C1D21',
            padding:4, display:'flex', gap:2 }}>
            {CHIPS.map(c => {
              const a = chip===c
              return (
                <button key={c} onClick={() => setChip(c)} className="pressable" style={{
                  flex:1, height:32, borderRadius:6,
                  background: a ? 'rgba(255,255,255,0.10)' : 'transparent',
                  border:'none', cursor:'pointer',
                  fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:700,
                  color: a ? '#fff' : 'rgba(255,255,255,0.4)',
                }}>{c}</button>
              )
            })}
          </div>

          {/* Featured Workout Header: Inter 20px fw=400 */}
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:20, fontWeight:400, color:'#fff' }}>
            Featured workout
          </div>

          {/* Workout cards: NFC Container r=8 bg=#1C1D21 p=16 */}
          <AnimatePresence mode="wait">
            <motion.div key={chip}
              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              transition={{duration:0.2}}
              style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {CARDS.map((card, i) => (
                <motion.div key={card.title}
                  initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                  transition={{delay:i*0.06}}
                  className="pressable"
                  onClick={() => onOpenContent && onOpenContent(card)}
                  style={{ width:370, borderRadius:8, background:'#1C1D21',
                    padding:16 }}>
                  <div style={{ display:'flex' }}>
                    {/* Workout Info: w=248 VERTICAL */}
                    <div style={{ width:248, display:'flex', flexDirection:'column', gap:6 }}>
                      {/* Title: Teko fw=400, size from Figma */}
                      <div style={{ fontFamily:'Teko,sans-serif', fontSize:card.titleSize,
                        fontWeight:400, color:'#fff',
                        lineHeight: card.titleSize===32 ? '36px' : '30px' }}>
                        {card.title}
                      </div>
                      {/* Desc: Inter 15px fw=300 */}
                      <div style={{ fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:300,
                        color:'rgba(255,255,255,0.65)', lineHeight:'20px' }}>
                        {card.desc}
                      </div>
                      {/* Duration • Level: Inter 13px fw=300 */}
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
                          color:'rgba(255,255,255,0.55)' }}>{card.dur}</span>
                        <span style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>•</span>
                        <span style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
                          color:card.levelColor }}>{card.level}</span>
                      </div>
                    </div>

                    {/* Product Image: Figma w=90 h=90, x=248 y=15 */}
                    <img src={card.img} style={{
                      width:90, height:90, objectFit:'contain',
                      marginLeft:'auto', flexShrink:0, marginTop:15 }}
                      alt={card.title}/>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div style={{height:8}}/>
        </div>
      </div>

      <NavBar active={activeTab} onChange={onTabChange}/>
    </div>
  )
}
