import React from 'react'
import { withStyles, createStyles } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import InputBase from '@material-ui/core/InputBase'

const BootstrapInput = error => withStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      'label + &': {
        marginTop: theme.spacing(1),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid',
      borderColor: error ? '#e00' : '#ced4da',
      fontSize: 14,
      padding: '8px 24px 8px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: error ? '#e00' : '#80bdff',
        boxShadow: error ? 'none' : '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }),
)(InputBase)

function Input (props, ref) {
  const { label, className, direction = 'ver', fullWidth, ..._props } = props
  const [Component, setComponent] = React.useState(BootstrapInput(props.error))
  const map = {
    'hoz': 'row',
    'ver': 'column'
  }

  React.useEffect(() => {
    setComponent(BootstrapInput(props.error))
  }, [props.error])

  return (
    <FormControl
      style={{
        flexDirection: map[direction],
        alignItems: direction === 'hoz' ? 'center' : 'flex-start',
      }}
      fullWidth={props.fullWidth}>
      <label style={{
        fontSize: 13,
        marginRight: direction === 'hoz' ? 4 : 0
      }}>{props.label}</label>
      {
        props.children || <Component ref={ref} className={className} {..._props} />
      }
      <div style={{
        color: '#e00',
        marginTop: 4,
        fontSize: 13,
        marginBottom: -8
      }}>{props.error}</div>
    </FormControl>
  )
}

export default React.forwardRef(Input)