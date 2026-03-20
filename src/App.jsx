import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import Stage        from './shell/Stage.jsx'
import PhoneShell   from './shell/PhoneShell.jsx'
import IAScreen     from './screens/IAScreen.jsx'

import PasswordGate         from './screens/PasswordGate.jsx'
import SplashScreen         from './screens/SplashScreen.jsx'
import FirstEntryScreen     from './screens/FirstEntryScreen.jsx'
import NFCFlow              from './screens/NFCFlow.jsx'
import WorkoutScreen        from './screens/WorkoutScreen.jsx'
import WorkoutDetailScreen  from './screens/WorkoutDetailScreen.jsx'
import WorkoutSummaryScreen from './screens/WorkoutSummaryScreen.jsx'
import JournalScreen        from './screens/JournalScreen.jsx'
import KnowledgeScreen      from './screens/KnowledgeScreen.jsx'
import ContentDetailScreen  from './screens/ContentDetailScreen.jsx'
import SignupLoginScreen     from './screens/SignupLoginScreen.jsx'
import OnboardingScreen     from './screens/OnboardingScreen.jsx'
import ProfileScreen        from './screens/ProfileScreen.jsx'
import NotificationsScreen  from './screens/NotificationsScreen.jsx'

const PAGE_T = { duration: 0.28, ease: [0.32, 0.72, 0, 1] }
const TAB_T  = { duration: 0.18, ease: 'easeInOut' }
const TAB_SCREENS = ['journal','knowledge','profile','notifications','firstEntry']

const slideV = {
  enter:  d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   d => ({ x: d < 0 ? '100%' : '-100%', opacity: 0 }),
}
const fadeV = {
  enter:  { opacity: 0, y: 4 },
  center: { opacity: 1, y: 0 },
  exit:   { opacity: 0, y: -4 },
}

export default function App() {
  const isIA = window.location.hash === '#ia' || window.location.pathname === '/ia'
  if (isIA) return <IAScreen/>

  const [unlocked,    setUnlocked]    = useState(false)
  const [screen,      setScreen]      = useState('splash')
  const [dir,         setDir]         = useState(1)
  const [tab,         setTab]         = useState('journal')
  const [annots,      setAnnots]      = useState(false)
  const [workoutData, setWorkoutData] = useState(null)
  const [connDevice,  setConnDevice]  = useState(null)
  // stack: where NFC should return when Back is pressed
  const prevScreen = useRef('splash')

  useEffect(() => {
    const h = e => { if (e.key==='m'||e.key==='M') setAnnots(v=>!v) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  function go(to, d=1) {
    prevScreen.current = screen
    setDir(d)
    setScreen(to)
  }

  function tabChange(id) {
    if (id === 'nfc') {
      go('nfc', 1)
      return
    }
    const dest = id
    setTab(dest)
    go(dest, 0)
  }

  // NFC connected
  function handleNFCConnected(deviceName) {
    setConnDevice(deviceName || 'TANK M1')
    go('workout', 1)
  }

  // NFC back — go back to where we came from
  function handleNFCBack() {
    go(prevScreen.current || 'splash', -1)
  }

  // Workout finished
  function handleWorkoutFinish() {
    setTab('journal')
    go('journal', -1)
  }

  // Connect new device from workout
  function handleConnectNew() {
    go('nfc', 1)
  }

  const isTab = TAB_SCREENS.includes(screen)

  const SCREENS = {
    splash: (
      <SplashScreen
        onStartWorkout={() => go('nfc', 1)}
        onLogin={() => go('login', 1)}
        onSignup={() => go('login', 1)}
      />
    ),
    login: (
      <SignupLoginScreen
        onBack={() => go('splash', -1)}
        onComplete={() => { setTab('journal'); go('firstEntry', 1) }}
      />
    ),
    onboarding: (
      <OnboardingScreen
        onComplete={() => { setTab('journal'); go('firstEntry', 1) }}
      />
    ),
    firstEntry: (
      <FirstEntryScreen
        onStartWorkout={() => go('nfc', 1)}
        activeTab={tab}
        onTabChange={tabChange}
      />
    ),
    nfc: (
      <NFCFlow
        onConnected={handleNFCConnected}
        onBack={handleNFCBack}
      />
    ),
    workout: (
      <WorkoutScreen
        device={connDevice}
        onFinish={handleWorkoutFinish}
        onConnectNew={handleConnectNew}
      />
    ),
    workoutSummary: (
      <WorkoutSummaryScreen
        onSignup={() => go('login', 1)}
        onExit={() => go('splash', -1)}
      />
    ),
    workoutDetail: (
      <WorkoutDetailScreen
        workout={workoutData}
        onBack={() => go('journal', -1)}
      />
    ),
    contentDetail: (
      <ContentDetailScreen
        onBack={() => go('knowledge', -1)}
        onStart={() => go('nfc', 1)}
      />
    ),
    journal: (
      <JournalScreen
        onStartWorkout={() => go('nfc', 1)}
        onOpenDetail={(w) => { setWorkoutData(w); go('workoutDetail', 1) }}
        activeTab={tab}
        onTabChange={tabChange}
      />
    ),
    knowledge: (
      <KnowledgeScreen
        onOpenContent={() => go('contentDetail', 1)}
        activeTab={tab}
        onTabChange={tabChange}
      />
    ),
    profile: (
      <ProfileScreen
        activeTab={tab}
        onTabChange={tabChange}
      />
    ),
    notifications: (
      <NotificationsScreen
        onReconnect={() => go('nfc', 1)}
        activeTab={tab}
        onTabChange={tabChange}
      />
    ),
  }

  return (
    <Stage>
      <PhoneShell showAnnotations={annots} screen={screen}>
        {!unlocked ? (
          <PasswordGate onUnlock={() => setUnlocked(true)}/>
        ) : (
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={screen}
              custom={dir}
              variants={isTab ? fadeV : slideV}
              initial="enter"
              animate="center"
              exit="exit"
              transition={isTab ? TAB_T : PAGE_T}
              style={{ position:'absolute', inset:0, willChange:'transform,opacity' }}
            >
              {SCREENS[screen] || SCREENS['journal']}
            </motion.div>
          </AnimatePresence>
        )}
      </PhoneShell>
    </Stage>
  )
}
