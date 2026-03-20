import React from 'react'

export default function HomeIndicator() {
  return (
    <div style={{
      position:'absolute', bottom:0, left:0, right:0,
      height:34, display:'flex',
      alignItems:'center', justifyContent:'center',
      paddingBottom:8, zIndex:100,
      pointerEvents:'none',
    }}>
      <div style={{
        width:144, height:5,
        background:'rgba(255,255,255,0.9)',
        borderRadius:100,
      }}/>
    </div>
  )
}
