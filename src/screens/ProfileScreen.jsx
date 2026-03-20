import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, LogOut, Trash2, Heart } from 'lucide-react'
import StatusBar from '../components/StatusBar.jsx'
import NavBar from '../components/NavBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'

const Row = ({ icon:Icon, label, value, onClick, danger }) => (
  <button onClick={onClick} className="pressable" style={{
    width:'100%', display:'flex', alignItems:'center',
    padding:'14px 0', background:'none', border:'none', cursor:'pointer',
    borderBottom:'1px solid rgba(255,255,255,0.05)', textAlign:'left',
  }}>
    {Icon && <Icon size={16} color={danger ? '#ef4444' : 'rgba(255,255,255,0.4)'} style={{marginRight:12, flexShrink:0}}/>}
    <div style={{ flex:1 }}>
      <div style={{ fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:400,
        color: danger ? '#ef4444' : '#fff' }}>{label}</div>
      {value && <div style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
        color:'rgba(255,255,255,0.35)', marginTop:2 }}>{value}</div>}
    </div>
    <ChevronRight size={16} color="rgba(255,255,255,0.2)"/>
  </button>
)

export default function ProfileScreen({ activeTab, onTabChange }) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)' }}>
      <StatusBar/>

      <div className="scroll" style={{
        position:'absolute', top:54, left:0, right:0, bottom:90, overflowY:'auto' }}>
        <div style={{ padding:'16px 16px 24px', display:'flex', flexDirection:'column', gap:16 }}>

          {/* Title */}
          <div style={{ fontFamily:'Teko,sans-serif', fontSize:32, fontWeight:400,
            color:'#F04E23', textTransform:'uppercase', letterSpacing:'0.04em', lineHeight:'36px' }}>
            Profile
          </div>

          {/* Avatar + name */}
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
            style={{
              background:'#1C1D21', borderRadius:12, padding:16,
              display:'flex', alignItems:'center', gap:14,
            }}>
            <div style={{
              width:52, height:52, borderRadius:'50%',
              background:'linear-gradient(135deg,#F04E23,#c93b18)',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              fontFamily:'Teko,sans-serif', fontSize:26, fontWeight:500, color:'#fff',
            }}>JD</div>
            <div>
              <div style={{ fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:400,
                color:'#fff', letterSpacing:'0.02em' }}>Jane Doe</div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
                color:'rgba(255,255,255,0.4)' }}>jane@example.com</div>
            </div>
          </motion.div>

          {/* Account section */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.08}}
            style={{ background:'#1C1D21', borderRadius:12, padding:'0 16px' }}>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:10, fontWeight:600,
              textTransform:'uppercase', letterSpacing:'0.08em',
              color:'rgba(255,255,255,0.3)', padding:'12px 0 4px' }}>Account</div>
            <Row label="Full name" value="Jane Doe"/>
            <Row label="Email" value="jane@example.com"/>
            <Row label="Password" value="Change password"/>
            <Row label="Log out" icon={LogOut}/>
          </motion.div>

          {/* Integrations */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.12}}
            style={{ background:'#1C1D21', borderRadius:12, padding:'0 16px' }}>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:10, fontWeight:600,
              textTransform:'uppercase', letterSpacing:'0.08em',
              color:'rgba(255,255,255,0.3)', padding:'12px 0 4px' }}>Integrations</div>
            <Row icon={Heart} label="Apple Health" value="Connected — syncing workouts"/>
          </motion.div>

          {/* Danger zone */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.16}}
            style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)',
              borderRadius:12, padding:'0 16px' }}>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:10, fontWeight:600,
              textTransform:'uppercase', letterSpacing:'0.08em',
              color:'rgba(239,68,68,0.5)', padding:'12px 0 4px' }}>Danger zone</div>
            <Row icon={Trash2} label="Delete account" value="Permanently remove all data" danger onClick={() => setShowDelete(true)}/>
          </motion.div>

          {/* Version */}
          <div style={{ textAlign:'center', fontFamily:'Space Mono,monospace', fontSize:10,
            color:'rgba(255,255,255,0.2)', padding:'8px 0' }}>
            Torque Connect v1.0 · Prototype
          </div>

        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDelete && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.72)',
                backdropFilter:'blur(8px)', zIndex:80 }}
              onClick={() => setShowDelete(false)}/>
            <motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}}
              transition={{type:'spring',stiffness:380,damping:36}}
              style={{
                position:'absolute', bottom:0, left:0, right:0,
                background:'#1C1D21', borderRadius:'16px 16px 0 0',
                padding:'20px 16px 48px', zIndex:90,
                borderTop:'1px solid rgba(255,255,255,0.08)',
              }}>
              <div style={{ width:40,height:4,background:'rgba(255,255,255,0.15)',
                borderRadius:2,margin:'0 auto 20px' }}/>
              <div style={{ fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:400,
                color:'#fff', marginBottom:8 }}>Delete account?</div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
                color:'rgba(255,255,255,0.5)', lineHeight:1.5, marginBottom:20 }}>
                This will permanently remove your account and all associated workout data. This action cannot be undone.
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <button onClick={() => setShowDelete(false)} className="pressable" style={{
                  width:'100%', height:44, borderRadius:6,
                  background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)',
                  fontFamily:'Teko,sans-serif', fontSize:22, fontWeight:500,
                  letterSpacing:'1px', color:'#ef4444', cursor:'pointer',
                }}>Delete my account</button>
                <button onClick={() => setShowDelete(false)} className="pressable" style={{
                  width:'100%', height:44, borderRadius:6,
                  background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                  fontFamily:'Teko,sans-serif', fontSize:22, fontWeight:500,
                  letterSpacing:'1px', color:'rgba(255,255,255,0.6)', cursor:'pointer',
                }}>Cancel</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <NavBar active={activeTab} onChange={onTabChange}/>
    </div>
  )
}
