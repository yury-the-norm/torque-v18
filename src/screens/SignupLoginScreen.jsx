import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import StatusBar from '../components/StatusBar.jsx'
import HomeIndicator from '../components/HomeIndicator.jsx'

const Field = ({ label, type='text', value, onChange, placeholder }) => {
  const [show, setShow] = useState(false)
  const isPass = type === 'password'
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontFamily:'Inter,sans-serif', fontSize:12, fontWeight:500,
        color:'rgba(255,255,255,0.5)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
        {label}
      </label>
      <div style={{
        display:'flex', alignItems:'center',
        background:'rgba(255,255,255,0.05)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:8, padding:'0 14px', height:48,
      }}>
        <input
          type={isPass && !show ? 'password' : 'text'}
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex:1, background:'none', border:'none', outline:'none',
            fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:300,
            color:'#fff', letterSpacing: isPass ? '0.1em' : '0' }}
        />
        {isPass && (
          <button onClick={() => setShow(s => !s)} style={{
            background:'none', border:'none', cursor:'pointer',
            color:'rgba(255,255,255,0.35)', padding:0, display:'flex',
          }}>
            {show ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        )}
      </div>
    </div>
  )
}

export default function SignupLoginScreen({ onBack, onComplete }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [name, setName] = useState('')
  const [sent, setSent] = useState(false)

  const titles = { login:'Log in', signup:'Create account', forgot:'Reset password' }

  return (
    <div style={{ width:'100%', height:'100%', position:'relative',
      background:'linear-gradient(180deg,#0E0E0F 0%,#1C1D21 100%)' }}>
      <StatusBar/>

      {/* Back */}
      <button onClick={onBack} className="pressable" style={{
        position:'absolute', top:62, left:16,
        width:36, height:36, borderRadius:8,
        background:'rgba(255,255,255,0.06)',
        border:'1px solid rgba(255,255,255,0.1)',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer',
      }}>
        <ArrowLeft size={18} color="#fff"/>
      </button>

      <div style={{
        position:'absolute', top:54, left:0, right:0, bottom:34,
        display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'0 24px',
      }}>
        <AnimatePresence mode="wait">
          <motion.div key={mode}
            initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}
            transition={{duration:0.22}}
            style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Title */}
            <div>
              <div style={{ fontFamily:'Teko,sans-serif', fontSize:38, fontWeight:400,
                color:'#fff', textTransform:'uppercase', letterSpacing:'0.04em', lineHeight:1 }}>
                {titles[mode]}
              </div>
              {mode === 'signup' && (
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
                  color:'rgba(255,255,255,0.4)', marginTop:4 }}>
                  Track your performance. Own your results.
                </div>
              )}
            </div>

            {/* Fields */}
            {mode === 'forgot' ? (
              sent ? (
                <div style={{
                  background:'rgba(46,204,113,0.1)', border:'1px solid rgba(46,204,113,0.25)',
                  borderRadius:8, padding:16,
                  fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
                  color:'#2ECC71', lineHeight:1.5,
                }}>
                  Check your email — we've sent a password reset link to {email || 'your address'}.
                </div>
              ) : (
                <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com"/>
              )
            ) : (
              <>
                {mode === 'signup' && (
                  <Field label="Full name" value={name} onChange={setName} placeholder="Jane Smith"/>
                )}
                <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com"/>
                <Field label="Password" type="password" value={pass} onChange={setPass} placeholder="••••••••"/>
              </>
            )}

            {/* Primary CTA */}
            <button onClick={() => {
              if (mode === 'forgot') { setSent(true); return; }
              onComplete && onComplete();
            }} className="pressable" style={{
              width:'100%', height:44, borderRadius:6,
              background:'#F04E23', border:'none',
              fontFamily:'Teko,sans-serif', fontSize:24, fontWeight:500,
              letterSpacing:'1.1px', color:'#fff', cursor:'pointer',
            }}>
              {mode === 'login' ? 'LOG IN' : mode === 'signup' ? 'CREATE ACCOUNT' : sent ? 'BACK TO LOG IN' : 'SEND RESET LINK'}
            </button>

            {/* Footer links */}
            <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'center' }}>
              {mode === 'login' && (
                <>
                  <button onClick={() => setMode('forgot')} className="pressable" style={{
                    background:'none', border:'none', cursor:'pointer',
                    fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
                    color:'rgba(255,255,255,0.4)', textDecoration:'underline',
                  }}>Forgot password?</button>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
                      color:'rgba(255,255,255,0.35)' }}>No account yet?</span>
                    <button onClick={() => setMode('signup')} className="pressable" style={{
                      background:'none', border:'none', cursor:'pointer',
                      fontFamily:'Teko,sans-serif', fontSize:18, fontWeight:500,
                      color:'#2D7FF9', letterSpacing:'0.5px',
                    }}>Sign up</button>
                  </div>
                </>
              )}
              {mode === 'signup' && (
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
                    color:'rgba(255,255,255,0.35)' }}>Already have an account?</span>
                  <button onClick={() => setMode('login')} className="pressable" style={{
                    background:'none', border:'none', cursor:'pointer',
                    fontFamily:'Teko,sans-serif', fontSize:18, fontWeight:500,
                    color:'#2D7FF9', letterSpacing:'0.5px',
                  }}>Log in</button>
                </div>
              )}
              {(mode === 'forgot' && !sent) && (
                <button onClick={() => setMode('login')} className="pressable" style={{
                  background:'none', border:'none', cursor:'pointer',
                  fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:300,
                  color:'rgba(255,255,255,0.4)',
                }}>Back to log in</button>
              )}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
      <HomeIndicator/>
    </div>
  )
}
