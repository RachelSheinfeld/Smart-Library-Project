import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A686D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#48A9A6',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#333D47',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#D9A14F',
      contrastText: '#1B2732',
    },
    background: {
      default: '#F4F7F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2933',
      secondary: '#52606D',
    },
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Roboto', 'sans-serif'].join(','),
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.05em',
    },
    h2: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 24px 60px rgba(44, 84, 96, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 20px 60px rgba(44, 84, 96, 0.08)',
        },
      },
    },
  },
})

export default theme
