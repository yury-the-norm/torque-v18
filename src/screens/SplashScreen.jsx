import React from 'react'
import { motion } from 'framer-motion'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import logoImg from '../assets/logo.png'

import { motion as M } from 'framer-motion'

// Figma: Button h=44 r=6 p=12 Teko Medium 500 24px ls=1.1
const Btn = ({ label, onClick, variant }) => {
  const s = {
    primary: { background:'#F04E23', border:'none', color:'#fff' },
    outline:  { background:'transparent', border:'2px solid rgba(255,255,255,0.2)', color:'#fff' },
    ghost:    { background:'transparent', border:'none', color:'rgba(255,255,255,0.6)' },
    blue:     { background:'rgba(45,127,249,0.12)', border:'1px solid rgba(45,127,249,0.35)', color:'#2D7FF9' },
  }[variant || 'ghost']
  return (
    <M.button onClick={onClick}
      whileHover={{ scale:1.02, opacity:0.9 }}
      whileTap={{ scale:0.96, opacity:0.75 }}
      style={{
        width:370, height:44, borderRadius:6, padding:'0 12px',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
        letterSpacing:'1.1px', cursor:'pointer', ...s,
      }}>{label}</M.button>
  )
}

export default function SplashScreen({ onStartWorkout, onLogin, onSignup }) {
  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)' }}>
      <StatusBar/>

      {/* Figma: Splash Content x=0 y=54 h=581 padding l=16 r=16 CENTER */}
      <div style={{
        position:'absolute', top:54, left:16, right:16, height:581,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:32,
      }}>
        {/* Logo: Figma 166×92px */}
        <motion.img
          src={logoImg}
          initial={{ opacity:0, scale:0.85 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.6, ease:[0.34,1.56,0.64,1] }}
          style={{ width:166, height:92, objectFit:'contain' }}
        />

        {/* Title: Teko Regular 32px lh=36 ls=1px UPPER */}
        <motion.div
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.18, duration:0.5 }}
          style={{ fontFamily:'Teko,sans-serif', fontSize:32, fontWeight:400,
            letterSpacing:'1px', textTransform:'uppercase',
            color:'#fff', lineHeight:'36px', textAlign:'center' }}
        >ENTER THE ZONE</motion.div>

        {/* Subtitle: Inter Regular 20px lh=24 opacity 80% */}
        <motion.div
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.3, duration:0.5 }}
          style={{ fontFamily:'Inter,sans-serif', fontSize:20, fontWeight:400,
            lineHeight:'24px', color:'rgba(255,255,255,0.8)', textAlign:'center' }}
        >Track your performance.&nbsp; Own your results.</motion.div>
      </div>

      {/* Figma: Splash Buttons x=16 y=635 w=370 gap=16 VERTICAL */}
      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.42, duration:0.5 }}
        style={{ position:'absolute', top:635, left:16, width:370,
          display:'flex', flexDirection:'column', gap:16 }}
      >
        <Btn label="START WORKOUT" onClick={onStartWorkout} variant="primary"/>
        <Btn label="I have an account" onClick={onLogin} variant="outline"/>
        {/* Figma: Divider opacity=24% */}
        <div style={{ opacity:0.24, height:1,
          background:'linear-gradient(90deg,transparent,#fff 50%,transparent)' }}/>
        <Btn label="Sign up" onClick={onSignup} variant="ghost"/>
      </motion.div>

      <HomeIndicator/>
    </div>
  )
}
