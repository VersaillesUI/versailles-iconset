import React from 'react'
import Box from '@material-ui/core/Box'

export default function Logo (props) {
  return <Box display="inline-flex" alignItems="center">
    {
      !props.disableLogoImage && <img style={{
        margin: -4
      }} width={40} height={40} src="/favicon.ico"></img>
    }
    <svg width={140} height={32}>
      <defs>
        <linearGradient id="color" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="#2A64FC"></stop>
          <stop offset="30%" stopColor="#94B6F7" />
          <stop offset="100%" stopColor="#BB25F8" />
        </linearGradient>
      </defs>
      <text style={{
        letterSpacing: '0.1em'
      }} x={props.disableLogoImage ? 0 : 10} y="52%" fill="url(#color)" fontSize={24} dominantBaseline="middle" fontFamily="华文细黑, 华文细黑1">华宇图标库</text>
    </svg>
  </Box>
}