import React, { useMemo } from 'react'

/*
  Figma chart specs (from node I262:5392):
  - 7 vertical lines at x = 0, 59, 118, 177, 236, 295, 354
    gradient stroke bottom→top opacity 0→0.6, weight=0.5px
  - 4 horizontal lines at y = 0, 53, 106, 160
    white solid 0.5px, opacity 0.15
  - Area fill: #F04E23 opacity 0.5→0 vertical gradient
  - Line stroke: #F04E23 1.5px
  - Dots at each intersection of line with vertical grid
  - X-axis labels: Space Mono 8px
*/

export default function FigmaChart({ data, width = 354, height = 160, labels }) {
  const W = width, H = height

  const pts = useMemo(() => {
    if (!data || data.length === 0) return []
    const vals = data.map(d => d.v)
    const max = Math.max(...vals, 1)
    return data.map((d, i) => ({
      x: (i / (data.length - 1)) * W,
      y: H - (d.v / max) * H * 0.85 - H * 0.06,
    }))
  }, [data, W, H])

  // Smooth bezier path
  const linePath = useMemo(() => {
    if (pts.length < 2) return ''
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1], p1 = pts[i]
      const cpx = (p0.x + p1.x) / 2
      d += ` C ${cpx} ${p0.y} ${cpx} ${p1.y} ${p1.x} ${p1.y}`
    }
    return d
  }, [pts])

  const areaPath = useMemo(() => {
    if (!linePath || pts.length === 0) return ''
    return `${linePath} L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`
  }, [linePath, pts, H])

  // Figma exact vertical lines
  const vLines = [0, 59, 118, 177, 236, 295, 354]
  // Figma exact horizontal lines
  const hLines = height === 160 ? [0, 53, 106, 160]
    : height === 120 ? [0, 40, 80, 120]
    : height === 80  ? [0, 26, 53, 80]
    : height === 72  ? [0, 24, 48, 72]
    : [0, Math.round(H/3), Math.round(H*2/3), H]

  // Scale vLines proportionally if width != 354
  const scaledVLines = W === 354 ? vLines
    : vLines.map(x => Math.round((x / 354) * W))

  // Find y on bezier curve at given x
  const dots = useMemo(() => {
    if (pts.length < 2) return []
    return scaledVLines.map(vx => {
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i], p1 = pts[i + 1]
        if (vx >= p0.x - 1 && vx <= p1.x + 1) {
          const t = (p1.x - p0.x) > 0 ? (vx - p0.x) / (p1.x - p0.x) : 0
          const mt = 1 - t
          // cubic bezier with midpoint control
          const y = mt*mt*mt*p0.y + 3*mt*mt*t*p0.y + 3*mt*t*t*p1.y + t*t*t*p1.y
          return { x: vx, y: Math.max(2, Math.min(H - 2, y)) }
        }
      }
      return null
    }).filter(Boolean)
  }, [pts, scaledVLines, H])

  const uid = useMemo(() => Math.random().toString(36).slice(2, 7), [])
  const areaGradId = `ag-${uid}`
  const vGradId    = `vg-${uid}`

  return (
    <div style={{ width: W, overflow: 'visible', flexShrink: 0 }}>
      <svg width={W} height={H} style={{ display:'block', overflow:'visible' }}>
        <defs>
          {/* Area fill gradient */}
          <linearGradient id={areaGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F04E23" stopOpacity="0.50"/>
            <stop offset="100%" stopColor="#F04E23" stopOpacity="0"/>
          </linearGradient>
          {/* Vertical line gradient: bottom=0.6 top=0 */}
          <linearGradient id={vGradId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="white" stopOpacity="0"/>
            <stop offset="100%" stopColor="white" stopOpacity="0.6"/>
          </linearGradient>
        </defs>

        {/* Horizontal grid lines — white 0.5px */}
        {hLines.map((y, i) => (
          <line key={`h${i}`} x1={0} y1={y} x2={W} y2={y}
            stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
        ))}

        {/* Vertical grid lines — gradient 0.5px */}
        {scaledVLines.map((x, i) => (
          <line key={`v${i}`} x1={x} y1={0} x2={x} y2={H}
            stroke={`url(#${vGradId})`} strokeWidth="0.5"/>
        ))}

        {/* Area fill */}
        {areaPath && (
          <path d={areaPath} fill={`url(#${areaGradId})`}/>
        )}

        {/* Main line */}
        {linePath && (
          <path d={linePath} fill="none"
            stroke="#F04E23" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        )}

        {/* Intersection dots */}
        {dots.map((dot, i) => (
          <circle key={`dot${i}`}
            cx={dot.x} cy={dot.y} r={2.5}
            fill="#F04E23"
            stroke="rgba(14,14,15,0.7)" strokeWidth="1"/>
        ))}

        {/* Final point — slightly larger with white ring */}
        {pts.length > 0 && (
          <circle
            cx={pts[pts.length-1].x}
            cy={pts[pts.length-1].y}
            r={3.5}
            fill="#F04E23"
            stroke="#fff" strokeWidth="1.2"/>
        )}
      </svg>

      {/* X-axis labels */}
      {labels && (
        <div style={{ display:'flex', justifyContent:'space-between',
          paddingTop: 3, height: 12 }}>
          {labels.map((l, i) => (
            <span key={i} style={{
              fontFamily: 'Space Mono, monospace', fontSize: 8, fontWeight: 400,
              color: 'rgba(255,255,255,0.4)',
              width: W / labels.length, textAlign: 'center', display: 'block',
            }}>{l}</span>
          ))}
        </div>
      )}
    </div>
  )
}
