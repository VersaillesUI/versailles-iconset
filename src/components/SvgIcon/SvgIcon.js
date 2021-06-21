import React from 'react'
import clsx from 'clsx'

export default function (props) {
  const { content, ..._props } = props
  return <span {..._props} className={clsx(['svg-icon', _props.className])} dangerouslySetInnerHTML={{ __html: props.content }}></span>
}