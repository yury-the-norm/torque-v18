import React, { useState } from 'react'

const DATA = {
  "SCR-00": {
    name: "Password gate",
    figma: "—",
    flow: "entry",
    stories: [],
    nav: ["→ SCR-01 Splash (correct password)"],
    notes: "Presentation-only gate. Not in production app.",
    status: "built"
  },
  "SCR-01": {
    name: "Splash",
    figma: "262:6207",
    flow: "entry",
    stories: [
      "As a new user, I want to sign up so I can start tracking workouts",
      "As a returning user, I want to log in to access my history",
      "As a guest user, I want to start without creating an account"
    ],
    nav: ["→ SCR-03 NFC (Start Workout)", "→ SCR-07 Sign up / Log in", "→ SCR-02 First entry (I have an account)"],
    notes: "Three CTAs: START WORKOUT · I have an account · Sign up",
    status: "built"
  },
  "SCR-02": {
    name: "First entry (empty state)",
    figma: "262:5311",
    flow: "entry",
    stories: [
      "As a new user, I want a short onboarding tutorial to learn how to connect",
      "As a user, I want to explore exercises before my first workout"
    ],
    nav: ["→ SCR-03 NFC (Start Workout)", "→ SCR-06 Knowledge (View Library)"],
    notes: "Shown when journal has zero sessions.",
    status: "built"
  },
  "SCR-07": {
    name: "Sign up / Log in",
    figma: "—",
    flow: "entry",
    stories: [
      "As a new user, I want to sign up to start tracking workouts",
      "As a returning user, I want to log in to access history",
      "As a user, I want to restore my password if I forget it"
    ],
    nav: ["→ SCR-08 Onboarding (new)", "→ SCR-02 First entry (returning, empty)", "→ SCR-05 Journal (returning, has data)"],
    notes: "To build: Login / create account / forgot password.",
    status: "todo"
  },
  "SCR-08": {
    name: "Onboarding",
    figma: "—",
    flow: "entry",
    stories: [
      "As a new user, I want a short onboarding tutorial",
      "As a user, I want to grant permission to share Apple Health data",
      "As a user, I want the app to prompt me to enable Bluetooth"
    ],
    nav: ["→ SCR-02 First entry (after onboarding)"],
    notes: "To build: permissions, BT, Health data steps.",
    status: "todo"
  },
  "SCR-03": {
    name: "NFC — Tap to connect",
    figma: "262:6286",
    flow: "equipment",
    stories: [
      "As a user, I want the app to prompt me to enable Bluetooth",
      "As a guest user, I want to connect to Torque equipment",
      "As a user, I want to be notified if the connection drops"
    ],
    nav: ["→ SCR-03B BT scanning (Can't find NFC tag)", "← Back to previous screen"],
    notes: "Pulse animation. Blue NFC icon. 'Bluetooth will activate automatically.'",
    status: "built"
  },
  "SCR-03B": {
    name: "BT scanning",
    figma: "262:6248",
    flow: "equipment",
    stories: [
      "As a user, I want the app to prompt me to enable Bluetooth",
      "As a guest user, I want to connect to equipment to track performance"
    ],
    nav: ["→ SCR-03C Device found (auto ~3s)", "← Cancel"],
    notes: "Auto-advances on detection. 'Scanning…' pulse animation.",
    status: "built"
  },
  "SCR-03C": {
    name: "Device found + pairing",
    figma: "262:6262 / 262:6274",
    flow: "equipment",
    stories: [
      "As a user, I want the app to detect when I start/pause equipment",
      "As a user, I want to connect to Torque equipment to track workout"
    ],
    nav: ["→ SCR-03D Connected (on PAIR)", "← Cancel"],
    notes: "Two variants: TANK M1 found & Relentless Ripper found.",
    status: "built"
  },
  "SCR-03D": {
    name: "Connected · START SESSION",
    figma: "262:6234",
    flow: "equipment",
    stories: [
      "As a user, I want to end my workout session so data is saved",
      "As a guest user, I want to connect to equipment to track performance"
    ],
    nav: ["→ SCR-04 Active workout (START SESSION)", "← Cancel"],
    notes: "Green checkmark animation. Device name shown.",
    status: "built"
  },
  "SCR-04": {
    name: "Active workout",
    figma: "262:5768",
    flow: "equipment",
    stories: [
      "As a user, I want the app to record performance metrics during exercise",
      "As a user, I want the app to detect when I start/pause using equipment",
      "As a guest user, I want to see performance metrics during workout",
      "As a user, I want Torque Connect to record performance during guided workout"
    ],
    nav: ["→ SCR-04B Finish modal (END)", "Pause / Resume in-screen"],
    notes: "Live chart · Timer · HR, Calories, Time · device status footer.",
    status: "built"
  },
  "SCR-04B": {
    name: "Finish modal",
    figma: "262:6188",
    flow: "equipment",
    stories: [
      "As a user, I want to end my workout so performance data can be saved",
      "As a guest user, I want to end my workout to review results"
    ],
    nav: ["→ SCR-05 Journal (Save — auth)", "→ SCR-09 Summary (Save — guest)", "→ SCR-04 Active (dismiss)"],
    notes: "Bottom sheet: 'Before we finish'. Save / End without saving.",
    status: "built"
  },
  "SCR-09": {
    name: "Workout summary",
    figma: "—",
    flow: "equipment",
    stories: [
      "As a guest user, I want to see the summary of my workout session",
      "As a guest user, I want to share my workout results",
      "As a guest user, I want to be prompted to create an account after workout"
    ],
    nav: ["→ Share sheet", "→ SCR-07 Sign up (Create account prompt)", "→ SCR-01 Splash (exit)"],
    notes: "Guest flow endpoint. Results + share + account creation prompt.",
    status: "todo"
  },
  "SCR-05": {
    name: "My Journal",
    figma: "262:5384",
    flow: "journal",
    stories: [
      "As a user, I want a dashboard showing workout history and performance stats",
      "As a user, I want to view a list of my recent workout sessions",
      "As a user, I want my workout data to sync with Apple Health"
    ],
    nav: ["→ SCR-03 NFC (START WORKOUT)", "→ SCR-05B Workout detail (tap card)", "⇄ SCR-06 Knowledge (tab)"],
    notes: "Teko orange title · Chart filters · Space Mono KPIs · Progress bars.",
    status: "built"
  },
  "SCR-05B": {
    name: "Workout detail",
    figma: "262:5695 (variant)",
    flow: "journal",
    stories: [
      "As a user, I want to view detailed info about a specific workout session",
      "As a user, I want to share my workout results on social media"
    ],
    nav: ["← Back to SCR-05 Journal", "→ Share sheet"],
    notes: "Full session metrics view. To build.",
    status: "todo"
  },
  "SCR-06": {
    name: "Training Knowledge",
    figma: "262:5336",
    flow: "journal",
    stories: [
      "As a user, I want to browse a knowledge library",
      "As a user, I want to view available content (workouts/guides/tutorials)",
      "As a user, I want to filter content by equipment type"
    ],
    nav: ["→ SCR-06B Content detail (tap card)", "⇄ SCR-05 Journal (tab)"],
    notes: "Featured/Exercise/Guides/Equipment chips · Tutorial section · Workout cards.",
    status: "built"
  },
  "SCR-06B": {
    name: "Content detail",
    figma: "—",
    flow: "journal",
    stories: [
      "As a user, I want to view details of selected content",
      "As a user, I want to start a guided workout from the library"
    ],
    nav: ["→ SCR-06C Guided workout (Start)", "← Back to SCR-06 Knowledge"],
    notes: "To build. Detail page for workout/guide/tutorial.",
    status: "todo"
  },
  "SCR-06C": {
    name: "Guided workout",
    figma: "—",
    flow: "journal",
    stories: [
      "As a user, I want to start a guided workout from the library",
      "As a user, I want Torque Connect to record performance during guided session"
    ],
    nav: ["→ SCR-03 NFC (if not connected)", "→ SCR-04 Active workout (if connected)", "← Back to SCR-06B"],
    notes: "Requires equipment. Records metrics same as free workout.",
    status: "todo"
  },
  "SCR-10": {
    name: "Profile",
    figma: "—",
    flow: "journal",
    stories: [
      "As a user, I want to view my profile information",
      "As a user, I want to update my profile information",
      "As a user, I want to delete my account so data is removed"
    ],
    nav: ["← Back to any tab", "→ Apple Health settings", "→ Delete account confirmation"],
    notes: "To build. Profile tab in NavBar.",
    status: "todo"
  },
  "SCR-11": {
    name: "Notifications",
    figma: "—",
    flow: "journal",
    stories: [
      "As a user, I want to be notified if the connection drops so I can reconnect"
    ],
    nav: ["→ SCR-03 NFC (reconnect)"],
    notes: "Notification tab in NavBar. Reconnect prompts.",
    status: "todo"
  }
}

const FLOWS = [
  { id: 'entry',     label: 'Entry & Auth',        screens: ['SCR-00','SCR-01','SCR-02','SCR-07','SCR-08'] },
  { id: 'equipment', label: 'Equipment & Workout',  screens: ['SCR-03','SCR-03B','SCR-03C','SCR-03D','SCR-04','SCR-04B','SCR-09'] },
  { id: 'journal',   label: 'Journal & Knowledge',  screens: ['SCR-05','SCR-05B','SCR-06','SCR-06B','SCR-06C','SCR-10','SCR-11'] },
]

const FLOW_COLORS = {
  entry:     { bg: 'rgba(83,74,183,0.08)',    border: 'rgba(83,74,183,0.25)',    text: '#534AB7', dot: '#534AB7' },
  equipment: { bg: 'rgba(15,110,86,0.08)',    border: 'rgba(15,110,86,0.25)',    text: '#0F6E56', dot: '#0F6E56' },
  journal:   { bg: 'rgba(45,127,249,0.08)',   border: 'rgba(45,127,249,0.25)',   text: '#185FA5', dot: '#185FA5' },
}

export default function IAScreen() {
  const [selected, setSelected] = useState(null)

  const d = selected ? DATA[selected] : null
  const fc = d ? FLOW_COLORS[d.flow] : null

  return (
    <div style={{
      width:'100%', minHeight:'100vh',
      background:'#0E0E0F',
      fontFamily:'Inter,sans-serif',
      color:'#fff',
      padding:'24px 20px',
      boxSizing:'border-box',
    }}>

      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <div style={{
          fontFamily:'Teko,sans-serif', fontSize:28, fontWeight:400,
          color:'#F04E23', letterSpacing:'0.04em', textTransform:'uppercase',
          marginBottom:4,
        }}>Torque Connect · Information Architecture</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>
          {Object.keys(DATA).length} screens · click any screen for user stories & navigation
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display:'flex', gap:16, flexWrap:'wrap',
        marginBottom:20, padding:'10px 14px',
        border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:8,
      }}>
        {Object.entries(FLOW_COLORS).map(([k, v]) => (
          <div key={k} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(255,255,255,0.5)' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:v.dot }}/>
            {FLOWS.find(f => f.id === k)?.label}
          </div>
        ))}
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(255,255,255,0.5)', marginLeft:'auto' }}>
          <div style={{ width:8, height:8, borderRadius:2, background:'rgba(240,78,35,0.6)' }}/> Built
          <div style={{ width:8, height:8, borderRadius:2, background:'rgba(255,255,255,0.15)', marginLeft:8 }}/> To build
        </div>
      </div>

      {/* Columns */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
        {FLOWS.map(flow => {
          const fc2 = FLOW_COLORS[flow.id]
          return (
            <div key={flow.id}>
              <div style={{
                fontSize:10, fontWeight:600, letterSpacing:'0.08em',
                textTransform:'uppercase', color: fc2.dot,
                marginBottom:8, paddingLeft:4,
              }}>{flow.label}</div>
              {flow.screens.map((sid, i) => {
                const s = DATA[sid]
                if (!s) return null
                const isActive = selected === sid
                const isBuilt = s.status === 'built'
                return (
                  <div key={sid}>
                    <div
                      onClick={() => setSelected(isActive ? null : sid)}
                      style={{
                        borderRadius:8, padding:'10px 12px',
                        border: isActive
                          ? `1px solid ${fc2.dot}`
                          : '1px solid rgba(255,255,255,0.07)',
                        background: isActive
                          ? fc2.bg
                          : 'rgba(28,29,33,0.8)',
                        cursor:'pointer',
                        transition:'border-color 0.15s, background 0.15s',
                        marginBottom:4,
                      }}
                    >
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2 }}>
                        <span style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontFamily:'Space Mono,monospace' }}>{sid}</span>
                        <span style={{
                          fontSize:9, padding:'1px 5px', borderRadius:3,
                          background: isBuilt ? 'rgba(240,78,35,0.2)' : 'rgba(255,255,255,0.07)',
                          color: isBuilt ? '#F04E23' : 'rgba(255,255,255,0.3)',
                          fontWeight:500,
                        }}>{isBuilt ? 'built' : 'todo'}</span>
                      </div>
                      <div style={{ fontSize:13, fontWeight:500, color:'#fff', marginBottom:2, fontFamily:'Teko,sans-serif', fontSize:16, letterSpacing:'0.02em' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', lineHeight:1.4 }}>
                        {s.notes.split('.')[0]}
                      </div>
                    </div>
                    {i < flow.screens.length - 1 && (
                      <div style={{ width:1, height:4, background:'rgba(255,255,255,0.1)', marginLeft:20, marginBottom:0 }}/>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Detail panel */}
      <div style={{
        border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:8, padding:16,
        background:'rgba(28,29,33,0.8)',
        minHeight:100,
        ...(d && fc ? { borderColor: fc.border, background: fc.bg } : {}),
      }}>
        {!d ? (
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'24px 0' }}>
            Нажми на любой экран — увидишь user stories и навигацию
          </div>
        ) : (
          <div>
            <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:8 }}>
              <div style={{ fontFamily:'Teko,sans-serif', fontSize:22, fontWeight:400, color:'#fff', letterSpacing:'0.02em' }}>
                {d.name}
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'Space Mono,monospace' }}>
                {selected} · figma: {d.figma}
              </div>
            </div>

            <div style={{
              fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:12,
              padding:'6px 10px', borderRadius:6,
              border:'1px solid rgba(255,255,255,0.07)',
              background:'rgba(0,0,0,0.2)',
            }}>{d.notes}</div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(255,255,255,0.3)', marginBottom:6 }}>
                  User stories ({d.stories.length})
                </div>
                {d.stories.length === 0
                  ? <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)' }}>No stories mapped</div>
                  : d.stories.map((s, i) => (
                    <div key={i} style={{
                      fontSize:12, color:'rgba(255,255,255,0.6)', lineHeight:1.5,
                      padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.05)',
                    }}>· {s}</div>
                  ))
                }
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(255,255,255,0.3)', marginBottom:6 }}>
                  Navigation
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {d.nav.map((n, i) => {
                    const idMatch = n.match(/SCR-\w+/)
                    return (
                      <div
                        key={i}
                        onClick={() => idMatch && DATA[idMatch[0]] && setSelected(idMatch[0])}
                        style={{
                          fontSize:12, padding:'5px 10px', borderRadius:6,
                          border:'1px solid rgba(255,255,255,0.1)',
                          color: idMatch && DATA[idMatch[0]] ? fc.text : 'rgba(255,255,255,0.4)',
                          background:'rgba(0,0,0,0.2)',
                          cursor: idMatch && DATA[idMatch[0]] ? 'pointer' : 'default',
                        }}
                      >{n}</div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
