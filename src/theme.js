import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#bbdefb',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  overrides: {
    MuiBadge: {
      root: {
        verticalAlign: 'top'
      }
    },
    MuiListItemIcon: {
      root: {
        minWidth: 36
      }
    }
  }
})

export default theme