import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bluetooth, Zap, Info, Check } from 'lucide-react'
import StatusBar from '../components/StatusBar.jsx'
import NavBar from '../components/NavBar.jsx'

const NOTIFS = [
  {
    id:1, type:'disconnect', read:false,
    title:'Connection lost',
    body:'Tank M1 disconnected during your session. Tap to reconnect.',
    time:'2 min ago',
    icon: Bluetooth, color:'#F04E23',
  },
  {
    id:2, type:'achievement', read:false,
    title:'New personal best',
    body:'712 N peak force — your highest ever recorded.',
    time:'1 hr ago',
    icon: Zap, color:'#2D7FF9',
  },
  {
    id:3, type:'info', read:true,
    title:'Workout saved',
    body:'Tank M1 + Relentless Ripper™ Pro · 32:42 session saved to journal.',
    time:'Yesterday',
    icon: Check, color:'#2ECC71',
  },
  {
    id:4, type:'info', read:true,
    title:'Apple Health synced',
    body:'3 workouts synced to Apple Health.',
    time:'2 days ago',
    icon: Info, color:'rgba(255,255,255,0.4)',
  },
]

export default function NotificationsScreen({ onReconnect, activeTab, onTabChange }) {
  const [notifs, setNotifs] = useState(NOTIFS)
  const unread = notifs.filter(n => !n.read).length

  function markRead(id) {
    setNotifs(ns => ns.map(n => n.id===id ? {...n, read:true} : n))
  }
  function markAll() {
    setNotifs(ns => ns.map(n => ({...n, read:true})))
  }

  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)' }}>
      <StatusBar/>

      <div className="scroll" style={{
        position:'absolute', top:54, left:0, right:0, bottom:90, overflowY:'auto' }}>
        <div style={{ padding:'16px 16px 24px' }}>

          {/* Header row */}
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <div style={{ fontFamily:'Teko,sans-serif', fontSize:32, fontWeight:400,
                color:'#F04E23', textTransform:'uppercase', letterSpacing:'0.04em', lineHeight:'36px' }}>
                Notifications
              </div>
              {unread > 0 && (
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
                  color:'rgba(255,255,255,0.4)' }}>{unread} unread</div>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAll} className="pressable" style={{
                background:'none', border:'none', cursor:'pointer',
                fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:400,
                color:'rgba(45,127,249,0.8)',
              }}>Mark all read</button>
            )}
          </div>

          {/* Notification list */}
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {notifs.map((n, i) => {
              const Icon = n.icon
              const isDisconnect = n.type === 'disconnect'
              return (
                <motion.div key={n.id}
                  initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}}
                  transition={{delay:i*0.05}}
                  onClick={() => { markRead(n.id); if(isDisconnect) onReconnect && onReconnect(); }}
                  style={{
                    background:'#1C1D21',
                    borderRadius:10,
                    padding:'12px 14px',
                    display:'flex', gap:12, alignItems:'flex-start',
                    border: !n.read ? `1px solid ${n.color}30` : '1px solid rgba(255,255,255,0.05)',
                    cursor: isDisconnect ? 'pointer' : 'default',
                    position:'relative', overflow:'hidden',
                  }}>
                  {/* Unread indicator */}
                  {!n.read && (
                    <div style={{
                      position:'absolute', left:0, top:0, bottom:0, width:3,
                      background:n.color, borderRadius:'10px 0 0 10px',
                    }}/>
                  )}
                  <div style={{
                    width:36, height:36, borderRadius:10, flexShrink:0,
                    background:`${n.color}15`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon size={16} color={n.color}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight: n.read ? 400 : 500,
                      color: n.read ? 'rgba(255,255,255,0.6)' : '#fff', marginBottom:3 }}>{n.title}</div>
                    <div style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
                      color:'rgba(255,255,255,0.4)', lineHeight:1.4 }}>{n.body}</div>
                    {isDisconnect && !n.read && (
                      <div style={{
                        marginTop:8, display:'inline-block',
                        background:'rgba(240,78,35,0.15)',
                        border:'1px solid rgba(240,78,35,0.3)',
                        borderRadius:6, padding:'3px 10px',
                        fontFamily:'Teko,sans-serif', fontSize:14, fontWeight:500,
                        color:'#F04E23', letterSpacing:'0.5px',
                      }}>Reconnect</div>
                    )}
                  </div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:10, fontWeight:300,
                    color:'rgba(255,255,255,0.25)', flexShrink:0, marginTop:2 }}>{n.time}</div>
                </motion.div>
              )
            })}
          </div>

          {notifs.length === 0 && (
            <div style={{ textAlign:'center', padding:'48px 0',
              fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
              color:'rgba(255,255,255,0.3)' }}>No notifications yet</div>
          )}

        </div>
      </div>

      <NavBar active={activeTab} onChange={onTabChange}/>
    </div>
  )
}
