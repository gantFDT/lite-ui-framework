import React from 'react'
import ViewPicker, { ViewProps } from '@/components/specific/viewpicker'

export default function getViewPicker(props: ViewProps) {
  const { config, ...configProps } = props;
  return {
    View: <ViewPicker {...configProps} />,
    ViewConfig: <ViewPicker {...props} />
  }
}
