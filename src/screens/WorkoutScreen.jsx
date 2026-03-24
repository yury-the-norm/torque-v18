import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import ProgressMetricRow from '../components/ProgressMetricRow.jsx'
import nfcIcon from '../assets/bottom_menu_icon.png'

/* ── helpers ─────────────────────────────────────────── */
function fmt(sec) {
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60
  return h ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
           : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}
function useTimer(active) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setT(v => v+1), 1000)
    return () => clearInterval(id)
  }, [active])
  return t
}

/* ── SVG chart (inline, so HotEndpoint can overlay) ─── */
function ChartSVG({ data, width: W, height: H }) {
  // Draw line up to 80% of width so endpoint has breathing room (~35px gap on right)
  const DRAW_W = Math.round(W * 0.80)

  const pts = React.useMemo(() => {
    if (!data?.length) return []
    const max = Math.max(...data.map(d => d.v), 1)
    return data.map((d,i) => ({
      x: (i/(data.length-1)) * DRAW_W,
      y: H - (d.v/max)*H*0.85 - H*0.06,
    }))
  }, [data, W, H])

  const linePath = React.useMemo(() => {
    if (pts.length < 2) return ''
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i=1; i<pts.length; i++) {
      const p0=pts[i-1], p1=pts[i], cpx=(p0.x+p1.x)/2
      d += ` C ${cpx} ${p0.y} ${cpx} ${p1.y} ${p1.x} ${p1.y}`
    }
    return d
  }, [pts])

  const areaPath = linePath
    ? `${linePath} L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`
    : ''

  const vLines = [0,59,118,177,236,295,354].map(x => Math.round((x/354)*W))
  const uid = React.useMemo(() => 'c'+Math.random().toString(36).slice(2,6), [])

  // last point for hot endpoint
  const lastPt = pts[pts.length-1]

  return (
    <svg width={W} height={H} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id={`ag${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F04E23" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#F04E23" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id={`vg${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0"/>
          <stop offset="100%" stopColor="white" stopOpacity="0.6"/>
        </linearGradient>
      </defs>

      {/* horizontal grid */}
      {[0, Math.round(H/3), Math.round(H*2/3), H].map((y,i) => (
        <line key={i} x1={0} y1={y} x2={W} y2={y}
          stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
      ))}

      {/* vertical grid */}
      {vLines.map((x,i) => (
        <line key={i} x1={x} y1={0} x2={x} y2={H}
          stroke={`url(#vg${uid})`} strokeWidth="0.5"/>
      ))}

      {/* area fill */}
      {areaPath && <path d={areaPath} fill={`url(#ag${uid})`}/>}

      {/* line */}
      {linePath && <path d={linePath} fill="none"
        stroke="#F04E23" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"/>}

      {/* grid intersection dots */}
      {vLines.map((vx,i) => {
        for (let j=0; j<pts.length-1; j++) {
          const p0=pts[j], p1=pts[j+1]
          if (vx >= p0.x-1 && vx <= p1.x+1) {
            const t2 = (p1.x-p0.x) > 0 ? (vx-p0.x)/(p1.x-p0.x) : 0
            const mt = 1-t2
            const y = mt*mt*mt*p0.y + 3*mt*mt*t2*p0.y + 3*mt*t2*t2*p1.y + t2*t2*t2*p1.y
            return <circle key={i} cx={vx} cy={Math.max(2,Math.min(H-2,y))} r={2.5}
              fill="#F04E23" stroke="rgba(14,14,15,0.7)" strokeWidth="1"/>
          }
        }
        return null
      })}

      {/* 🔥 Hot endpoint with sparks */}
      {lastPt && <HotEndpoint cx={lastPt.x} cy={lastPt.y}/>}
    </svg>
  )
}

/* ── 🔥 Hot endpoint — fire tip + gravity sparks ─────── */
function Spark({ cx, cy, angle, speed, delay }) {
  const rad = angle * Math.PI / 180
  // Sparks fly outward then arc down with gravity
  const vx = Math.cos(rad) * speed
  const vy = Math.sin(rad) * speed
  const dur = 0.7 + Math.random() * 0.4

  // Keyframe positions: start → mid (flying) → end (fallen + faded)
  const x0 = cx, y0 = cy
  const x1 = cx + vx * 8,  y1 = cy + vy * 8 - 4   // arc peak
  const x2 = cx + vx * 16, y2 = cy + vy * 16 + 10  // fall with gravity

  return (
    <motion.circle r={1.2}
      style={{ transformOrigin:`${cx}px ${cy}px` }}
      animate={{
        cx: [x0, x1, x2],
        cy: [y0, y1, y2],
        opacity: [0.95, 0.7, 0],
        r: [1.5, 1.0, 0.4],
      }}
      transition={{
        repeat: Infinity,
        duration: dur,
        delay,
        ease: 'easeIn',
        times: [0, 0.4, 1],
      }}
      fill={angle % 60 === 0 ? '#FFB347' : angle % 30 === 0 ? '#F8901A' : '#F04E23'}
    />
  )
}

function HotEndpoint({ cx, cy }) {
  // 12 sparks at varied angles — mostly upward (negative y in SVG)
  const sparks = [
    { angle:-80, speed:1.2, delay:0 },
    { angle:-60, speed:1.5, delay:0.08 },
    { angle:-45, speed:1.8, delay:0.15 },
    { angle:-30, speed:1.4, delay:0.22 },
    { angle:-15, speed:1.6, delay:0.05 },
    { angle:-95, speed:1.3, delay:0.18 },
    { angle:-110,speed:1.1, delay:0.12 },
    { angle:-130,speed:1.4, delay:0.28 },
    { angle:-50, speed:2.0, delay:0.35 },
    { angle:-70, speed:1.7, delay:0.42 },
    { angle:-25, speed:1.9, delay:0.30 },
    { angle:-100,speed:1.5, delay:0.20 },
  ]

  return (
    <g>
      {/* Outer glow ring — breathes */}
      <motion.circle cx={cx} cy={cy} r={8}
        fill="none" stroke="#F04E23" strokeWidth="1.5"
        animate={{ r:[8,14,8], opacity:[0.4,0,0.4] }}
        transition={{ repeat:Infinity, duration:1.2, ease:'easeOut' }}/>

      {/* Inner warm glow */}
      <motion.circle cx={cx} cy={cy} r={5}
        fill="#F8901A"
        animate={{ opacity:[0.3,0.6,0.3], r:[4,6,4] }}
        transition={{ repeat:Infinity, duration:0.8, ease:'easeInOut' }}/>

      {/* Sparks — gravity arcs */}
      {sparks.map((s, i) => (
        <Spark key={i} cx={cx} cy={cy} angle={s.angle} speed={s.speed} delay={s.delay}/>
      ))}

      {/* Core dot — white hot center */}
      <circle cx={cx} cy={cy} r={3.5} fill="#F04E23" stroke="#fff" strokeWidth="1.4"/>
      <motion.circle cx={cx} cy={cy} r={1.5}
        fill="#fff"
        animate={{ opacity:[1,0.4,1] }}
        transition={{ repeat:Infinity, duration:0.6, ease:'easeInOut' }}/>
    </g>
  )
}

/* ── Session detail popup (Figma 329:19562) ─────────── */
function SessionDetailPopup({ deviceName, chartRef, forceRef, hrRef, onClose, onEndSession }) {
  // Poll refs at 1s so chart + metrics stay live inside popup
  const [liveChart, setLiveChart] = useState(() => chartRef?.current || [])
  const [liveForce, setLiveForce] = useState(() => forceRef?.current || 560)
  const [liveHr,    setLiveHr]    = useState(() => hrRef?.current    || 132)
  const elapsed = useTimer(true)

  useEffect(() => {
    const id = setInterval(() => {
      if (chartRef?.current) setLiveChart([...chartRef.current])
      if (forceRef?.current) setLiveForce(forceRef.current)
      if (hrRef?.current)    setLiveHr(hrRef.current)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const METRICS = [
    [
      { label:'Force (N)',    value: String(liveForce) },
      { label:'Distance (m)', value: '18' },
    ],
    [
      { label:'Speed (m/s)', value: '1.8' },
      { label:'Calories',    value: '3' },
    ],
    [
      { label:'Energy (J)',  value: '1250', fire: true },
      { label:'Duration (T)', value: fmt(elapsed) },
    ],
  ]

  return (
    <>
      {/* Dim backdrop */}
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        onClick={onClose}
        style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.55)',
          backdropFilter:'blur(6px)', zIndex:48, borderRadius:44 }}/>

      {/* Sheet — 75% of screen height = ~655px of 874px frame */}
      <motion.div
        initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
        transition={{ type:'spring', stiffness:340, damping:34 }}
        style={{
          position:'absolute', left:0, right:0, bottom:0,
          height:'75%',              /* 75% of 874px ≈ 655px */
          background:'#111214',
          borderRadius:'20px 20px 44px 44px',
          zIndex:50,
          display:'flex', flexDirection:'column',
          overflow:'hidden',
        }}>

        {/* Drag handle */}
        <div style={{ width:36, height:4, background:'rgba(255,255,255,0.2)',
          borderRadius:2, margin:'10px auto 6px', flexShrink:0 }}/>

        {/* Header */}
        <div style={{ padding:'0 20px 8px', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
              color:'#fff', textTransform:'uppercase', letterSpacing:'0.04em', lineHeight:'26px' }}>
              {deviceName}
            </div>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300, color:'#2ECC71' }}>
              Recording
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>🔥</span>
            <motion.button onClick={onClose} whileTap={{ scale:0.92 }}
              style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
                borderRadius:8, padding:'4px 12px', cursor:'pointer',
                fontFamily:'Inter,sans-serif', fontSize:12, color:'rgba(255,255,255,0.5)' }}>
              Collapse
            </motion.button>
          </div>
        </div>

        {/* Chart — 2× taller than before: 160px */}
        <div style={{ padding:'0 16px 10px', flexShrink:0 }}>
          <ChartSVG data={liveChart} width={370} height={160}/>
        </div>

        {/* Metrics 2×3 grid — bigger tiles */}
        <div style={{ padding:'0 16px', flexShrink:0,
          display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {METRICS.map((row, ri) => row.map((m, ci) => (
            <div key={`${ri}-${ci}`} style={{ background:'#1C1D21', borderRadius:10,
              padding:'12px 14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:4 }}>
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:300,
                  color:'rgba(255,255,255,0.45)' }}>{m.label}</span>
                {m.fire && <span style={{ fontSize:10 }}>🔥</span>}
              </div>
              <motion.div key={m.value} initial={{ opacity:0.6,y:-2 }} animate={{ opacity:1,y:0 }}
                style={{ fontFamily:'Space Mono,monospace', fontSize:36, fontWeight:400,
                  color:'#fff', lineHeight:1 }}>
                {m.value}
              </motion.div>
            </div>
          )))}
        </div>

        {/* Spacer pushes button down */}
        <div style={{ flex:1 }}/>

        {/* Pause notice */}
        <div style={{ padding:'8px 20px 6px', flexShrink:0,
          fontFamily:'Inter,sans-serif', fontSize:12,
          fontWeight:300, color:'rgba(255,255,255,0.35)' }}>
          Pause after 5 seconds without movement.
        </div>

        {/* End session button */}
        <div style={{ padding:'0 16px', flexShrink:0 }}>
          <motion.button onClick={onEndSession} whileTap={{ scale:0.97 }}
            style={{ width:'100%', height:44, borderRadius:6,
              background:'rgba(240,78,35,0.12)', border:'1px solid rgba(240,78,35,0.4)',
              fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
              letterSpacing:'1px', color:'#F04E23', cursor:'pointer' }}>
            End session
          </motion.button>
        </div>

        {/* Black safe-area bar — covers home indicator, keeps button visible */}
        <div style={{ height:34, background:'#111214', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:144, height:5, borderRadius:100,
            background:'rgba(255,255,255,0.25)' }}/>
        </div>
      </motion.div>
    </>
  )
}

/* ── Live session card (ACTIVE — at top of journal) ── */
/* Figma Frame 3: h=278, contains header row, metrics, chart, expand button */
const LIVE_INIT = [{v:0},{v:80},{v:200},{v:320},{v:280},{v:420},{v:500},{v:460},{v:540},{v:580},{v:560},{v:611}]

function LiveSession({ deviceName, onEndSession, onExpand }) {
  const elapsed = useTimer(true)
  const [chartData, setChartData] = useState(LIVE_INIT)
  const [force, setForce] = useState(560)
  const [hr, setHr]       = useState(132)
  // Keep live ref so popup always reads current data
  const chartRef = useRef(chartData)
  const forceRef = useRef(force)
  const hrRef    = useRef(hr)
  useEffect(() => { chartRef.current = chartData }, [chartData])
  useEffect(() => { forceRef.current = force },      [force])
  useEffect(() => { hrRef.current = hr },            [hr])

  useEffect(() => {
    // Original ~1s cadence but stronger amplitude swings
    const id = setInterval(() => {
      setChartData(d => {
        const last = d[d.length-1].v
        const drift = (Math.random() - 0.48) * 160   // strong amplitude, ~1s feel
        return [...d.slice(-24), { v: Math.max(40, Math.min(800, last + drift)) }]
      })
      setForce(f => Math.round(Math.max(200, Math.min(720, f + (Math.random()-0.45)*55))))
      setHr(h    => Math.round(Math.max(100, Math.min(175, h + (Math.random()-0.45)*8))))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }}
      transition={{ type:'spring', stiffness:280, damping:26 }}
      style={{ width:'100%', borderRadius:8,
        border:'1px solid rgba(240,78,35,0.3)',
        background:'rgba(28,29,33,0.95)', overflow:'hidden' }}>

      {/* Frame 16: header — device name + timer (Figma: h=20 text size=13) */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'10px 12px 6px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <motion.div animate={{ opacity:[1,0.2,1] }}
            transition={{ repeat:Infinity, duration:1.4 }}
            style={{ width:8, height:8, borderRadius:'50%', background:'#F04E23' }}/>
          <span style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:400,
            color:'rgba(255,255,255,0.8)' }}>{deviceName}</span>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:13,
            color:'rgba(255,255,255,0.4)' }}>{fmt(elapsed)}</span>
        </div>
      </div>

      {/* Activity label (Figma: "Tank PUSH" size=26 Teko) */}
      <div style={{ fontFamily:'Teko,sans-serif', fontSize:26, color:'#fff',
        lineHeight:'30px', padding:'2px 12px 8px' }}>Tank PUSH</div>

      {/* Frame 8: metric cells + expand icon (h=44) */}
      {/* Figma: Frame3(143px) + Frame1(143px) + Frame7(36px expand icon) */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 12px 8px' }}>
        {/* Metric cell 1: HR */}
        <div style={{ flex:1, height:44, background:'rgba(255,255,255,0.04)',
          borderRadius:6, display:'flex', flexDirection:'column',
          justifyContent:'center', padding:'0 10px' }}>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:9, fontWeight:300,
            color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>HR</div>
          <motion.div key={hr} initial={{ opacity:0.5,y:-2 }} animate={{ opacity:1,y:0 }}
            style={{ fontFamily:'Space Mono,monospace', fontSize:18, color:'#ef4444', lineHeight:1 }}>
            {hr}<span style={{ fontSize:10, opacity:0.6 }}>bpm</span>
          </motion.div>
        </div>
        {/* Metric cell 2: Force */}
        <div style={{ flex:1, height:44, background:'rgba(255,255,255,0.04)',
          borderRadius:6, display:'flex', flexDirection:'column',
          justifyContent:'center', padding:'0 10px' }}>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:9, fontWeight:300,
            color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>Force</div>
          <motion.div key={force} initial={{ opacity:0.5,y:-2 }} animate={{ opacity:1,y:0 }}
            style={{ fontFamily:'Space Mono,monospace', fontSize:18, color:'#F04E23', lineHeight:1 }}>
            {force}<span style={{ fontSize:10, opacity:0.6 }}>N</span>
          </motion.div>
        </div>
        {/* Frame 7: expand icon 36×36 */}
        <motion.button
          onClick={() => onExpand({ chartRef, forceRef, hrRef })}
          whileHover={{ background:'rgba(255,255,255,0.14)' }}
          whileTap={{ scale:0.88 }}
          style={{ width:36, height:36, borderRadius:8, flexShrink:0,
            background:'rgba(255,255,255,0.08)', border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9"
              stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </motion.button>
      </div>

      {/* Chart: Figma w=354 h=90 x=8 y=128 */}
      <div style={{ padding:'0 8px 8px' }}>
        <ChartSVG data={chartData} width={354} height={90}/>
      </div>

      {/* Button: "End session" h=44 Figma y=226 */}
      <div style={{ padding:'0 8px 10px' }}>
        <motion.button
          onClick={() => onEndSession({ duration:elapsed, force, hr })}
          whileHover={{ background:'rgba(240,78,35,0.22)' }}
          whileTap={{ scale:0.97 }}
          style={{ width:'100%', height:44, borderRadius:6,
            background:'rgba(240,78,35,0.12)', border:'1px solid rgba(240,78,35,0.35)',
            fontFamily:'Teko,sans-serif', fontSize:22, fontWeight:500,
            letterSpacing:'0.8px', color:'#F04E23', cursor:'pointer' }}>
          End session
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ── Completed session card (Figma Frame 4, h=148) ── */
function SessionCard({ session, idx }) {
  return (
    <motion.div
      initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
      transition={{ delay:idx*0.06, type:'spring', stiffness:340, damping:28 }}
      style={{ width:'100%', borderRadius:8,
        border:'1px solid rgba(255,255,255,0.06)',
        background:'rgba(28,29,33,0.7)', padding:8 }}>
      {/* Frame 16: header */}
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:session.dotColor||'#888' }}/>
          <span style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
            color:'rgba(255,255,255,0.7)' }}>{session.deviceName}</span>
        </div>
        <span style={{ fontFamily:'Space Mono,monospace', fontSize:13, color:'rgba(255,255,255,0.6)' }}>
          {fmt(session.duration)}
        </span>
      </div>
      {/* Activity name: Teko 26px */}
      <div style={{ fontFamily:'Teko,sans-serif', fontSize:26, color:'#fff',
        lineHeight:'30px', marginBottom:6 }}>{session.activityName}</div>
      {/* Metrics */}
      {session.metrics.map((m,i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', height:20, alignItems:'center' }}>
          <span style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:400,
            color:'rgba(255,255,255,0.55)' }}>{m.label}</span>
          <span style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:700,
            color:m.color||'rgba(255,255,255,0.8)' }}>{m.value}</span>
        </div>
      ))}
      {/* Progress bars */}
      {session.bars && (
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:8 }}>
          {session.bars.map((b,i) => (
            <ProgressMetricRow key={i} label={b.label} value={b.value}
              barWidth={b.width} barColor={b.color}/>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ── Finish modal ────────────────────────────────────── */
function FinishModal({ onSave, onDiscard }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)',
        backdropFilter:'blur(10px)', zIndex:60,
        display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
      <motion.div
        initial={{ y:120 }} animate={{ y:0 }} exit={{ y:120 }}
        transition={{ type:'spring', stiffness:360, damping:34 }}
        style={{ background:'#1C1D21', borderRadius:'16px 16px 0 0',
          borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width:32, height:4, background:'rgba(255,255,255,0.15)',
          borderRadius:2, margin:'8px auto 24px' }}/>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:20, color:'#fff',
          padding:'0 20px', marginBottom:0 }}>
          Before we finish
        </div>
        <div style={{ padding:'16px 16px 0', display:'flex', flexDirection:'column', gap:12 }}>
          <motion.button onClick={onSave} whileTap={{ scale:0.97 }}
            style={{ width:'100%', height:44, borderRadius:6, background:'#F04E23', border:'none',
              fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
              letterSpacing:'1.1px', color:'#fff', cursor:'pointer' }}>
            Save results
          </motion.button>
          <motion.button onClick={onDiscard} whileTap={{ scale:0.97 }}
            style={{ width:'100%', height:44, borderRadius:6,
              background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
              fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
              letterSpacing:'1.1px', color:'rgba(255,255,255,0.55)', cursor:'pointer' }}>
            End without saving
          </motion.button>
        </div>
        <HomeIndicator/>
      </motion.div>
    </motion.div>
  )
}

/* ── Initial sessions ─────────────────────────────────── */
const INIT_SESSIONS = [
  { id:1, type:'general', deviceName:'Apple Watch', activityName:'General activity',
    dotColor:'rgba(255,255,255,0.4)', duration:372,
    metrics:[
      { label:'Avg HR',   value:'-- bpm', color:'rgba(255,255,255,0.45)' },
      { label:'Calories', value:'0 kcal' },
    ],
  },
]

/* ── WorkoutScreen ───────────────────────────────────── */
export default function WorkoutScreen({ device, onFinish, onConnectNew }) {
  const totalTime = useTimer(true)
  const [sessions,    setSessions]    = useState(INIT_SESSIONS)
  const [liveRunning, setLiveRunning] = useState(true)
  const [showFinish,  setShowFinish]  = useState(false)
  const [expanded,    setExpanded]    = useState(null) // session detail popup state
  const [globalHr,  setGlobalHr]  = useState(132)
  const [globalCal, setGlobalCal] = useState(24)
  const deviceName = device || 'TANK M1'

  useEffect(() => {
    const id = setInterval(() => {
      setGlobalHr(h => Math.round(Math.max(100,Math.min(175,h+(Math.random()-.45)*5))))
      setGlobalCal(c => c+1)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  function endSession({ duration, force, hr }) {
    setLiveRunning(false)
    setExpanded(null)
    setSessions(prev => [...prev, {
      id: Date.now(), type:'device', deviceName,
      activityName:'Tank PUSH', dotColor:'#F04E23', duration,
      metrics:[
        { label:'MaX Force',      value:`${force} N`, color:'#F04E23' },
        { label:'Total Distance', value:'18 m' },
        { label:'Avg HR',         value:`${hr} bpm`,  color:'#ef4444' },
        { label:'Calories',       value:'24 kcal' },
      ],
      bars:[
        { label:'MaX Force',      value:`${force} N`, width:Math.round((force/720)*340), color:'#F04E23' },
        { label:'Total Distance', value:'18 m', width:220, color:'rgb(105,108,120)' },
      ],
    }])
  }

  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#1C1D21 0%,#0E0E0F 100%)' }}>
      <StatusBar/>

      {/* ── HEADER 180px ─────────────────────────────── */}
      <div style={{ position:'absolute', top:'var(--status-h, 54px)', left:0, right:0, height:180,
        background:'#1C1D21', zIndex:10, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ position:'absolute', top:16, left:16, right:16, height:112 }}>
          {/* Status row: title + END */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:44 }}>
            <div style={{ fontFamily:'Teko,sans-serif', fontSize:26, color:'#F04E23',
              textTransform:'uppercase', letterSpacing:'0.04em', lineHeight:'28px',
              whiteSpace:'nowrap', overflow:'hidden' }}>
              Workout in progress
            </div>
            <motion.button onClick={() => setShowFinish(true)}
              whileHover={{ scale:1.06, background:'rgba(255,255,255,0.16)' }} whileTap={{ scale:0.92 }}
              style={{ width:63, height:44, borderRadius:6, background:'rgba(255,255,255,0.09)',
                border:'1px solid rgba(255,255,255,0.22)', fontFamily:'Teko,sans-serif',
                fontSize:20, fontWeight:500, letterSpacing:'0.8px', color:'#fff', cursor:'pointer',
                flexShrink:0, marginLeft:8 }}>
              END
            </motion.button>
          </div>
          {/* Metrics row: HR / Calories / Time */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0,
            display:'flex', height:44, alignItems:'center' }}>
            {[
              { label:'HR',       value:`${globalHr}`, unit:'bpm', color:'#ef4444', align:'flex-start' },
              { label:'Calories', value:`${String(globalCal).padStart(3,'0')}`, unit:'kcal', color:'#fff', align:'center' },
              { label:'Time',     value:fmt(totalTime), unit:'', color:'#fff', align:'flex-end' },
            ].map((m,i) => (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column',
                justifyContent:'center', alignItems:m.align }}>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:11, fontWeight:300,
                  color:'rgba(255,255,255,0.4)', textTransform:'uppercase',
                  letterSpacing:'0.06em', marginBottom:2 }}>{m.label}</div>
                <motion.div key={m.value} initial={{ opacity:0.5 }} animate={{ opacity:1 }}
                  style={{ fontFamily:'Space Mono,monospace', fontSize:18, color:m.color }}>
                  {m.value}<span style={{ fontSize:11, opacity:0.6 }}>{m.unit}</span>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position:'absolute', bottom:12, left:16,
          fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:300,
          color:'rgba(255,255,255,0.5)' }}>Workout journal</div>
      </div>

      {/* ── JOURNAL: live session FIRST, then completed ── */}
      <div className="scroll" style={{
        position:'absolute', top:'calc(var(--status-h, 54px) + 180px)', left:0, right:0, bottom:146,
        overflowY:'auto', display:'flex', flexDirection:'column',
        alignItems:'center', gap:12, padding:'16px 0' }}>

        {/* 🔴 ACTIVE session at top */}
        {liveRunning && (
          <LiveSession
            deviceName={deviceName}
            onEndSession={endSession}
            onExpand={(state) => setExpanded(state)}/>
        )}

        {/* Completed sessions below */}
        {sessions.map((s,i) => (
          <SessionCard key={s.id} session={s} idx={i}/>
        ))}
      </div>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:146,
        background:'#0a0b0d', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        {deviceName && (
          <div style={{ height:40, display:'flex', alignItems:'center',
            padding:'0 24px', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <motion.div animate={{ opacity:[1,0.3,1] }}
                transition={{ repeat:Infinity, duration:1.6 }}
                style={{ width:6, height:6, borderRadius:'50%', background:'#2ECC71' }}/>
              <span style={{ fontFamily:'Teko,sans-serif', fontSize:20, color:'#fff' }}>{deviceName}</span>
            </div>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:11,
              color:'rgba(255,255,255,0.35)' }}>
              {liveRunning ? 'recording' : 'ready'}
            </span>
          </div>
        )}
        <motion.button onClick={onConnectNew}
          whileHover={{ background:'rgba(45,127,249,0.1)' }} whileTap={{ scale:0.97 }}
          style={{ width:'100%', height:72, border:'none',
            borderTop:'1px solid rgba(255,255,255,0.05)', background:'transparent',
            cursor:'pointer', display:'flex', alignItems:'center', gap:12, padding:'0 16px' }}>
          <div style={{ width:64, height:64, borderRadius:12, flexShrink:0,
            background:'rgba(45,127,249,0.08)', border:'1px solid rgba(45,127,249,0.2)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <img src={nfcIcon} style={{ width:28, height:28, opacity:0.7 }} alt="NFC"/>
          </div>
          <span style={{ fontFamily:'Inter,sans-serif', fontSize:11, fontWeight:300,
            color:'rgba(255,255,255,0.5)' }}>Connect Torque device</span>
        </motion.button>
        <HomeIndicator/>
      </div>

      {/* ── SESSION DETAIL POPUP ─────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <SessionDetailPopup
            deviceName={deviceName}
            chartRef={expanded.chartRef}
            forceRef={expanded.forceRef}
            hrRef={expanded.hrRef}
            onClose={() => setExpanded(null)}
            onEndSession={() => { endSession({ duration:0, force: expanded.forceRef?.current || 560, hr: expanded.hrRef?.current || 132 }); setExpanded(null) }}/>
        )}
      </AnimatePresence>

      {/* ── FINISH MODAL ─────────────────────────────── */}
      <AnimatePresence>
        {showFinish && (
          <FinishModal
            onSave={() => { setShowFinish(false); onFinish && onFinish('saved') }}
            onDiscard={() => { setShowFinish(false); onFinish && onFinish('discard') }}/>
        )}
      </AnimatePresence>
    </div>
  )
}
