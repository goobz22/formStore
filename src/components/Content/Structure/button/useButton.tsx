'use client'
import React from 'react'
import CustomButton, { CustomButtonProps } from './../../../Button'
import { columnconfig, cellconfig } from '../../../Grid'

export interface ExtendedButtonProps extends CustomButtonProps {
  columnconfig?: Partial<columnconfig>
  cellconfig?: cellconfig
}

const useButton = (grid: {
  button?: ExtendedButtonProps | ExtendedButtonProps[]
}) => {
  if (!grid.button) return null

  const renderButton = (
    buttonItem: ExtendedButtonProps,
    index: number
  ): columnconfig => {
    const {
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = buttonItem

    if (
      !itemColumnConfig ||
      typeof itemColumnConfig !== 'object' ||
      typeof itemColumnConfig.row !== 'number' ||
      typeof itemColumnConfig.column !== 'number'
    ) {
      throw new Error(
        'columnconfig must be an object with row and column as numbers'
      )
    }

    const mergedConfig: columnconfig = {
      ...(itemColumnConfig as columnconfig),
      cellconfig: {
        ...cellconfig,
      },
      component: <CustomButton key={`button-${index}`} {...restProps} />,
    }

    return mergedConfig
  }

  if (Array.isArray(grid.button)) {
    return grid.button.map(renderButton)
  } else {
    return [renderButton(grid.button, 0)]
  }
}

export default useButton
