import { Box, SvgIcon, Typography } from '@mui/material'

interface LogoProps {
  mini?: boolean
  size?: number
}

const Logo = ({ mini = false, size = 54 }: LogoProps) => {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: mini ? 0 : 1, color: 'text.primary' }}>
      <SvgIcon
        viewBox="0 0 92 92"
        sx={{ width: size, height: size, display: 'block' }}
      >
        <defs>
          <linearGradient id="SmartLibraryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A686D" />
            <stop offset="55%" stopColor="#48A9A6" />
            <stop offset="100%" stopColor="#D9A14F" />
          </linearGradient>
        </defs>
        <path
          fill="url(#SmartLibraryGradient)"
          d="M14 22c0-4.42 3.58-8 8-8h10c2.21 0 4 1.79 4 4v44c0 2.21-1.79 4-4 4H22c-4.42 0-8-3.58-8-8V22Zm44 0c0-4.42 3.58-8 8-8h10c4.42 0 8 3.58 8 8v44c0 4.42-3.58 8-8 8H66c-2.21 0-4-1.79-4-4V22Zm-28 4v34.5c0 2.48 2.03 4.5 4.5 4.5H50v-9c0-1.1.9-2 2-2h10V26H50c-2.47 0-4.5 2.02-4.5 4.5V40H34Zm7.5 0H34v-6H40.5c1.38 0 2.5 1.12 2.5 2.5V40Zm20 26h-6v8h6c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2Z"
        />
      </SvgIcon>
      {!mini ? (
        <Typography variant="h3" component="span" sx={{ fontWeight: 800, letterSpacing: '0.08em' }}>
          SMART LIBRARY
        </Typography>
      ) : null}
    </Box>
  )
}

export default Logo
