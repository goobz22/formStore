'use client'
import React from 'react'
import { Box } from '@mui/material'
import type { DatagridProps } from '../../DataGrid'
import DataGrid from '../../DataGrid'

export interface FormDataGridProps {
  title: string
  description: string
  datagrid: DatagridProps
}

function FormDataGrid({ title, description, datagrid }: FormDataGridProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        overflow: 'hidden',
        '& *': {
          overflow: 'hidden !important',
        },
      }}
    >
      <Box
        sx={{
          marginTop: 1,
          marginBottom: 1,
          width: '100%',
        }}
      >
        <Box
          sx={{
            marginBottom: 0.5,
            width: '100%',
            textAlign: 'left',
            fontFamily: 'Merriweather',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: 'black',
          }}
        >
          {title}
        </Box>
        <Box
          sx={{
            width: '100%',
            textAlign: 'left',
            fontFamily: 'Merriweather',
            fontSize: '1.25rem',
            fontWeight: 400,
            color: 'black',
          }}
        >
          {description}
        </Box>
      </Box>
      <DataGrid {...datagrid} />
    </Box>
  )
}

export default FormDataGrid