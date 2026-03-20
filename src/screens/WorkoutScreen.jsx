import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'
import FigmaChart from '../components/FigmaChart.jsx'
import ProgressMetricRow from '../components/ProgressMetricRow.jsx'
import nfcIcon from '../assets/bottom_menu_icon.png'

/* ─── Helpers ─────────────────────────────────────────── */
function fmt(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return h
    ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

function useTimer(active) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setT(v => v + 1), 1000)
    return () => clearInterval(id)
  }, [active])
  return t
}

/* ─── Session card (completed) — matches Figma "Journal entry" / "Journal Record Container" */
function SessionCard({ session, idx }) {
  const isDevice = session.type === 'device'
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: idx * 0.07, type: 'spring', stiffness: 340, damping: 28 }}
      style={{
        width: 370, borderRadius: 8,
        background: isDevice ? '#1C1D21' : 'rgba(28,29,33,0.6)',
        border: `1px solid ${isDevice ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
        padding: 8,
      }}
    >
      {/* Row 1: name + time — matches "Journal entry header" */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 4 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%',
            background: session.dotColor || 'rgba(255,255,255,0.3)', flexShrink: 0 }}/>
          <span style={{ fontFamily:'Inter,sans-serif', fontSize: 13, fontWeight: 300,
            color: 'rgba(255,255,255,0.7)' }}>{session.deviceName}</span>
        </div>
        <span style={{ fontFamily:'Space Mono,monospace', fontSize: 13, fontWeight: 400,
          color: '#fff' }}>{fmt(session.duration)}</span>
      </div>

      {/* Row 2: activity type — Figma "Activity description" size=26 Teko */}
      <div style={{ fontFamily:'Teko,sans-serif', fontSize: 26, fontWeight: 400,
        color: '#fff', lineHeight: '32px', marginBottom: 6 }}>
        {session.activityName}
      </div>

      {/* Metrics rows — Figma size=13 label w=300 value w=68 right-aligned */}
      <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
        {session.metrics.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between',
            height: 20, alignItems:'center' }}>
            <span style={{ fontFamily:'Inter,sans-serif', fontSize: 13, fontWeight: 400,
              color: 'rgba(255,255,255,0.7)' }}>{m.label}</span>
            <span style={{ fontFamily:'Inter,sans-serif', fontSize: 13, fontWeight: 700,
              color: m.color || '#fff' }}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Progress bars for device sessions */}
      {session.bars && (
        <div style={{ display:'flex', flexDirection:'column', gap: 6, marginTop: 8 }}>
          {session.bars.map((b, i) => (
            <ProgressMetricRow key={i}
              label={b.label} value={b.value}
              barWidth={b.width} barColor={b.color}/>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ─── Live session strip ──────────────────────────────── */
const LIVE_CHART_INIT = [
  {v:0},{v:120},{v:260},{v:400},{v:360},{v:480},{v:540},{v:500},{v:560},{v:611},{v:580},{v:620},
]

function LiveSession({ deviceName, onEndSession }) {
  const elapsed = useTimer(true)
  const [chartData, setChartData] = useState(LIVE_CHART_INIT)
  const [force, setForce] = useState(560)
  const [hr, setHr] = useState(132)

  useEffect(() => {
    const id = setInterval(() => {
      setChartData(d => {
        const last = d[d.length - 1].v
        const next = Math.max(0, Math.min(800, last + (Math.random() - 0.42) * 110))
        return [...d.slice(-22), { v: next }]
      })
      setForce(f => Math.round(Math.max(200, Math.min(720, f + (Math.random() - 0.45) * 40))))
      setHr(h => Math.round(Math.max(100, Math.min(175, h + (Math.random() - 0.45) * 6))))
    }, 1200)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      style={{
        width: 370, borderRadius: 8, overflow: 'hidden',
        border: '1px solid rgba(240,78,35,0.3)',
        background: 'rgba(28,29,33,0.95)',
      }}
    >
      {/* Live header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: '10px 12px 6px' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <motion.div animate={{ opacity: [1, 0.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#F04E23' }}/>
          <span style={{ fontFamily:'Teko,sans-serif', fontSize: 26, fontWeight: 400,
            color: '#fff', lineHeight: '28px' }}>Tank PUSH</span>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize: 12,
            color: 'rgba(255,255,255,0.4)' }}>{fmt(elapsed)}</span>
        </div>
        <motion.button
          onClick={() => onEndSession({ duration: elapsed, force, hr })}
          whileHover={{ scale: 1.06, background: 'rgba(240,78,35,0.25)' }}
          whileTap={{ scale: 0.93 }}
          style={{
            background: 'rgba(240,78,35,0.12)',
            border: '1px solid rgba(240,78,35,0.4)',
            borderRadius: 6, padding: '3px 12px',
            fontFamily: 'Teko,sans-serif', fontSize: 18, fontWeight: 500,
            letterSpacing: '0.8px', color: '#F04E23', cursor: 'pointer',
          }}
        >END SESSION</motion.button>
      </div>

      {/* Live metrics */}
      <div style={{ display:'flex', gap: 0, padding: '0 12px 8px', justifyContent:'space-around' }}>
        {[
          { label: 'HR',    value: `${hr}`,   unit: 'bpm', color: '#ef4444' },
          { label: 'Force', value: `${force}`, unit: 'N',   color: '#F04E23' },
          { label: 'kcal',  value: '24',       unit: '',    color: 'rgba(255,255,255,0.7)' },
        ].map((m, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize: 9, fontWeight: 300,
              color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
              letterSpacing: '0.06em', marginBottom: 2 }}>{m.label}</div>
            <motion.div
              key={m.value}
              initial={{ opacity: 0.6, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ fontFamily:'Space Mono,monospace', fontSize: 20, color: m.color, lineHeight: 1 }}>
              {m.value}<span style={{ fontSize: 10, opacity: 0.6 }}>{m.unit}</span>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-enter" style={{ padding: '0 8px 8px' }}>
        <FigmaChart data={chartData} width={354} height={72}/>
      </div>
    </motion.div>
  )
}

/* ─── Finish Workout Modal — Figma 402×241px ─────────── */
function FinishModal({ onSave, onDiscard }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position:'absolute', inset: 0, background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(10px)', zIndex: 60,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
    >
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 34 }}
        style={{
          background: '#1C1D21',
          borderRadius: '16px 16px 0 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '0 0 0 0',
          minHeight: 241,
        }}
      >
        {/* Figma: drag handle 32×4 at top center */}
        <div style={{ width: 32, height: 4, background: 'rgba(255,255,255,0.15)',
          borderRadius: 2, margin: '8px auto 24px' }}/>

        {/* Figma: "Before we finish" size=20 w=276 x=63 y=32 */}
        <div style={{ fontFamily:'Inter,sans-serif', fontSize: 20, fontWeight: 400,
          color: '#fff', paddingLeft: 29, marginBottom: 0 }}>Before we finish</div>

        {/* Button container: w=344 x=29 y=88 gap=16 */}
        <div style={{ padding: '16px 29px 0', display:'flex', flexDirection:'column', gap: 16 }}>
          <motion.button onClick={onSave}
            whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: 344, height: 44, borderRadius: 6,
              background: '#F04E23', border: 'none',
              fontFamily: 'Teko,sans-serif', fontSize: 24, fontWeight: 500,
              letterSpacing: '1.1px', color: '#fff', cursor: 'pointer',
            }}>Save results</motion.button>

          <motion.button onClick={onDiscard}
            whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: 344, height: 44, borderRadius: 6,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              fontFamily: 'Teko,sans-serif', fontSize: 24, fontWeight: 500,
              letterSpacing: '1.1px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
            }}>End without saving</motion.button>
        </div>
        <HomeIndicator/>
      </motion.div>
    </motion.div>
  )
}

/* ─── WorkoutScreen ────────────────────────────────────── */
const INITIAL_SESSIONS = [
  {
    id: 1, type: 'general', deviceName: 'Apple Watch',
    activityName: 'General activity',
    dotColor: 'rgba(255,255,255,0.4)', duration: 372,
    metrics: [
      { label: 'Avg HR',   value: '-- bpm', color: 'rgba(255,255,255,0.5)' },
      { label: 'Calories', value: '0 kcal'  },
    ],
  },
]

export default function WorkoutScreen({ device, isGuest, onFinish, onConnectNew }) {
  const totalTime   = useTimer(true)
  const [sessions,    setSessions]    = useState(INITIAL_SESSIONS)
  const [liveRunning, setLiveRunning] = useState(true)
  const [showFinish,  setShowFinish]  = useState(false)
  const scrollRef = useRef()
  const deviceName = device || 'TANK M1'

  // Header metrics mock
  const [globalHr, setGlobalHr]     = useState(132)
  const [globalCal, setGlobalCal]   = useState(24)
  useEffect(() => {
    const id = setInterval(() => {
      setGlobalHr(h  => Math.round(Math.max(100, Math.min(175, h + (Math.random()-0.45)*5))))
      setGlobalCal(c => c + 1)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  function endSession({ duration, force, hr }) {
    setLiveRunning(false)
    const s = {
      id: Date.now(), type: 'device', deviceName,
      activityName: 'Tank PUSH',
      dotColor: '#F04E23', duration,
      metrics: [
        { label: 'MaX Force',      value: `${force} N`,  color: '#F04E23' },
        { label: 'Total Distance', value: '18 m' },
        { label: 'Energy',         value: '1250 J' },
        { label: 'Avg HR',         value: `${hr} bpm`, color: '#ef4444' },
        { label: 'Calories',       value: '24 kcal' },
      ],
      bars: [
        { label: 'MaX Force',      value: `${force} N`, width: Math.round((force/720)*340), color: '#F04E23' },
        { label: 'Total Distance', value: '18 m',        width: 220,  color: 'rgb(105,108,120)' },
      ],
    }
    setSessions(prev => [...prev, s])
    setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 120)
  }

  function handleFinish(result) {
    setShowFinish(false)
    onFinish && onFinish(result)
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative',
      background: 'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)' }}>
      <StatusBar/>

      {/* ── HEADER — Figma: 402×180 y=54 ─────────────── */}
      <div style={{
        position: 'absolute', top: 54, left: 0, right: 0, height: 180,
        background: '#1C1D21', zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Info Section: w=370 h=112 x=16 y=16 */}
        <div style={{ position:'absolute', top: 16, left: 16, width: 370, height: 112 }}>

          {/* Status Section: h=44 — title + END button */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height: 44 }}>
            {/* Workout Status */}
            <div style={{ display:'flex', flexDirection:'column', gap: 2 }}>
              <div style={{ fontFamily:'Teko,sans-serif', fontSize: 26, fontWeight: 400,
                color: '#F04E23', textTransform: 'uppercase', letterSpacing: '0.04em',
                lineHeight: '28px' }}>Workout in progress</div>
            </div>
            {/* END button: w=63 h=44 */}
            <motion.button
              onClick={() => setShowFinish(true)}
              whileHover={{ scale: 1.06, background: 'rgba(255,255,255,0.16)' }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: 63, height: 44, borderRadius: 6,
                background: 'rgba(255,255,255,0.09)',
                border: '1px solid rgba(255,255,255,0.22)',
                fontFamily: 'Teko,sans-serif', fontSize: 20, fontWeight: 500,
                letterSpacing: '0.8px', color: '#fff', cursor: 'pointer',
              }}>END</motion.button>
          </div>

          {/* Metrics Section: h=44 y=60 — HR / Calories / Time */}
          <div style={{ position:'absolute', bottom: 0, left: 0, right: 0,
            display:'flex', gap: 0, height: 44, alignItems:'center' }}>
            {[
              { label: 'HR',       value: `${globalHr}`, unit: 'bpm', color: '#ef4444', w: 113 },
              { label: 'Calories', value: `${String(globalCal).padStart(3,'0')}`, unit: 'kcal', color: '#fff', w: 113 },
              { label: 'Time',     value: fmt(totalTime), unit: '', color: '#fff', w: 113 },
            ].map((m, i) => (
              <div key={i} style={{ width: m.w, display:'flex', flexDirection:'column',
                justifyContent:'center', alignItems: i === 0 ? 'flex-start' : i === 2 ? 'flex-end' : 'center' }}>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize: 11, fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
                  letterSpacing: '0.06em', marginBottom: 2 }}>{m.label}</div>
                <motion.div key={m.value} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
                  style={{ fontFamily:'Space Mono,monospace', fontSize: 18, color: m.color }}>
                  {m.value}<span style={{ fontSize: 11, opacity: 0.6 }}>{m.unit}</span>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* "Workout journal" label — Figma size=15 w300 y=144 */}
        <div style={{ position:'absolute', bottom: 12, left: 16,
          fontFamily:'Inter,sans-serif', fontSize: 15, fontWeight: 300,
          color: 'rgba(255,255,255,0.5)' }}>Workout journal</div>
      </div>

      {/* ── JOURNAL SECTION — scrollable 402×640 y=234 ── */}
      <div ref={scrollRef} className="scroll" style={{
        position: 'absolute', top: 234, left: 0, right: 0, bottom: 146,
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column', alignItems:'center',
        gap: 12, padding: '16px 0 16px',
      }}>
        {sessions.map((s, i) => (
          <SessionCard key={s.id} session={s} idx={i}/>
        ))}

        {liveRunning && (
          <LiveSession deviceName={deviceName} onEndSession={endSession}/>
        )}
      </div>

      {/* ── FOOTER — Figma: 402×146 at bottom ────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 146,
        background: '#0E0E0F',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Footer content: device status 40px */}
        {deviceName && (
          <div style={{ height: 40, display:'flex', alignItems:'center',
            padding: '0 24px', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
              <motion.div animate={{ opacity: [1,0.3,1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                style={{ width: 6, height: 6, borderRadius:'50%', background: '#2ECC71' }}/>
              <span style={{ fontFamily:'Teko,sans-serif', fontSize: 20, fontWeight: 400,
                color: '#fff', letterSpacing: '0.02em' }}>{deviceName}</span>
            </div>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize: 11,
              color: 'rgba(255,255,255,0.35)' }}>
              {liveRunning ? 'recording' : 'ready'}
            </span>
          </div>
        )}

        {/* Connect Section: h=72 */}
        <motion.button
          onClick={onConnectNew}
          whileHover={{ background:'rgba(45,127,249,0.1)', borderColor:'rgba(45,127,249,0.45)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', height: 72, border: 'none',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'transparent', cursor: 'pointer',
            display:'flex', alignItems:'center', gap: 12,
            padding: '0 16px',
            transition: 'all 0.18s',
          }}
        >
          {/* NFC icon — Figma 64×64 at x=16 y=8 */}
          <div style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0,
            background: 'rgba(45,127,249,0.08)',
            border: '1px solid rgba(45,127,249,0.2)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <img src={nfcIcon} style={{ width: 28, height: 28, opacity: 0.7 }} alt="NFC"/>
          </div>
          {/* Figma: "Connect Torque device" size=11 weight=300 x=96 */}
          <span style={{ fontFamily:'Inter,sans-serif', fontSize: 11, fontWeight: 300,
            color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em' }}>
            Connect Torque device
          </span>
        </motion.button>

        <HomeIndicator/>
      </div>

      {/* ── FINISH MODAL ─────────────────────────────── */}
      <AnimatePresence>
        {showFinish && (
          <FinishModal
            onSave={() => handleFinish('saved')}
            onDiscard={() => handleFinish('discard')}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
