import React from 'react'
import { motion } from 'framer-motion'
import iconJournal       from '../assets/icons/icon-journal.svg'
import iconKnowledge     from '../assets/icons/icon-knowledge.svg'
import iconNotifications from '../assets/icons/icon-notifications.svg'
import iconProfile       from '../assets/icons/icon-profile.svg'
import nfcIcon           from '../assets/bottom_menu_icon.png'

/*
 Figma NavBar exact (402×90):
 Bottom Navigation row: 402×56
   Tab[0] Journal:       x=0,   w=73
   Tab[1] Knowledge:     x=81,  w=73
   Frame2 (FAB wrap):    x=161, w=80, h=80, y=-24  → center at x=201 = 402/2 ✓
   Tab[2] Notifications: x=249, w=73
   Tab[3] Profile:       x=330, w=73

 FAB inside Frame2: w=64 h=64 at x=8,y=8 → absolute x=169, y=-16
   fill = rgba(255,255,255,0.10)
   cornerRadius = 16 (rounded square, NOT circle)
   NO border

 Key: parent must be position:relative with width=402
      FAB left = 169 (= 201 - 32)
*/

const TABS = [
  { id:'journal',       label:'Journal',       icon:iconJournal,        x:0   },
  { id:'knowledge',     label:'Knowledge',     icon:iconKnowledge,      x:81  },
  { id:'notifications', label:'Notifications', icon:iconNotifications,  x:249 },
  { id:'profile',       label:'Profile',       icon:iconProfile,        x:330 },
]

export default function NavBar({ active = 'journal', onChange }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0,
      width: 402, height: 90,
      background: '#1C1D21',
    }}>
      {/* Nav row: 402×56, position:relative so FAB absolute coords work */}
      <div style={{
        position: 'relative',
        width: 402, height: 56,
      }}>

        {/* Four tab cells at exact Figma x-positions */}
        {TABS.map(tab => {
          const isActive = active === tab.id
          const color = isActive ? '#F04E23' : 'rgba(255,255,255,0.45)'
          return (
            <motion.button
              key={tab.id}
              onClick={() => onChange && onChange(tab.id)}
              whileTap={{ scale: 0.84 }}
              style={{
                position: 'absolute',
                left: tab.x, top: 0,
                width: 73, height: 56,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 4,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0,
              }}
            >
              <img src={tab.icon} alt={tab.label}
                style={{
                  width: 24, height: 24,
                  filter: isActive
                    ? 'invert(42%) sepia(97%) saturate(1300%) hue-rotate(340deg) brightness(105%)'
                    : 'invert(1) brightness(0.45)',
                  transition: 'filter 0.15s',
                  display: 'block',
                }}/>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 400,
                color, lineHeight: '16px', whiteSpace: 'nowrap',
                transition: 'color 0.15s',
              }}>{tab.label}</span>
            </motion.button>
          )
        })}

        {/* NFC FAB — absolute position matching Figma exactly:
            Frame2 x=161, FAB x=8 inside → left=169
            Frame2 y=-24, FAB y=8 inside → top=-16
            width=64, height=64, r=16 */}
        <motion.button
          onClick={() => onChange && onChange('nfc')}
          whileTap={{ scale: 0.88 }}
          style={{
            position: 'absolute',
            left: 169,    /* 161 + 8 */
            top: -16,     /* -24 + 8 */
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.10)',
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            /* explicitly no box-shadow, no outline */
            boxShadow: 'none',
            outline: 'none',
          }}
        >
          <img src={nfcIcon} alt="NFC"
            style={{ width: 36, height: 36, opacity: 0.9, display: 'block' }}/>
        </motion.button>
      </div>

      {/* Home indicator: 402×34 */}
      <div style={{
        width: 402, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 144, height: 5,
          borderRadius: 100,
          background: 'rgba(255,255,255,0.3)',
        }}/>
      </div>
    </div>
  )
}
