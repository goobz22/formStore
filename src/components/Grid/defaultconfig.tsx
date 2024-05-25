import { gridconfig, rowconfig, columnconfig } from './index'
import Typography from '../../components/Typography'
import React from 'react'

export const defaultGridConfig: gridconfig = {
  rows: 2,
  gridname: 'testgrid',
  margintop: 10,
  marginbottom: 2,
  marginright: 2,
  marginleft: 10,
  gridwidth: '100%',
  animation: 'none',
}

export const defaultRowConfig: rowconfig = {
  columns: 3,
  gridname: 'testgrid',
  alignment: 'center',
  rowwidth: '100%',
  marginbetweenrows: 2,
  margintop: 2,
  marginbottom: 2,
  marginright: 0,
  marginleft: 2,
  animation: 'none',
}

export const defaultColumnConfig: columnconfig[] = [
  {
    row: 1,
    column: 1,
    gridname: 'testgrid',
    alignment: 'left',
    columnwidth: '33.33%',
    margintop: 1,
    marginbottom: 1,
    marginright: 0,
    marginleft: 0,
    animation: 'none',
    component: <Typography variant="h4" text="Column 1" />,
  },
  {
    row: 1,
    column: 2,
    gridname: 'testgrid',
    alignment: 'left',
    columnwidth: '33.33%',
    margintop: 1,
    marginbottom: 1,
    marginright: 0,
    marginleft: 0,
    animation: 'none',
    component: <Typography variant="h4" text="Column 2" />,
  },
  {
    row: 1,
    column: 3,
    gridname: 'testgrid',
    alignment: 'left',
    columnwidth: '33.33%',
    margintop: 1,
    marginbottom: 1,
    marginright: 0,
    marginleft: 0,
    animation: 'none',
    component: <Typography variant="h4" text="Column 3" />,
  },
  {
    row: 2,
    column: 1,
    gridname: 'testgrid',
    alignment: 'center',
    columnwidth: '33.33%',
    margintop: 1,
    marginbottom: 1,
    marginright: 2,
    marginleft: 2,
    animation: 'none',
    component: <Typography variant="h4" text="Column 4" />,
  },
  {
    row: 2,
    column: 2,
    gridname: 'testgrid',
    alignment: 'center',
    columnwidth: '33.33%',
    margintop: 1,
    marginbottom: 1,
    marginright: 2,
    marginleft: 2,
    animation: 'none',
    component: <Typography variant="h4" text="Column 5" />,
  },
  {
    row: 2,
    column: 3,
    gridname: 'testgrid',
    alignment: 'center',
    columnwidth: '33.33%',
    margintop: 1,
    marginbottom: 1,
    marginright: 0,
    marginleft: 0,
    animation: 'none',
    component: <Typography variant="h4" text="Column 6" />,
  },
]
