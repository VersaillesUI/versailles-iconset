import React from 'react'
import Box from '@material-ui/core/Box'
import T from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      padding: theme.spacing(0.5, 0)
    },
    label: {
      flexGrow: 1,
      color: theme.palette.grey[500]
    }
  }
})

export default function (props) {
  const classes = useStyles()
  return <Box display="flex" className={classes.root}>
    <T variant="body2" className={classes.label}>{props.label}</T>
    <T variant="body2">{props.children}</T>
  </Box>
}