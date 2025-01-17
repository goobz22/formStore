import React from 'react'
import RadioGroup from '../../../RadioGroup'
import { columnconfig, cellconfig } from '../../../Grid'
import { RadioGroupProps as BaseRadioGroupProps } from '../../../../components/RadioGroup'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedRadioGroupProps
  extends Omit<BaseRadioGroupProps, 'columnconfig'> {
  columnconfig?: ExtendedColumnConfig
  cellconfig?: cellconfig
}

const useGridRadioGroup = (grid: {
  radiogroup?: ExtendedRadioGroupProps | ExtendedRadioGroupProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.radiogroup) return null

  const renderRadioGroup = (
    radiogroup: ExtendedRadioGroupProps,
    index: number
  ): columnconfig => {
    const {
      label,
      options,
      defaultValue,
      name,
      labelFontVariant,
      labelFontColor,
      labelText,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = radiogroup

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

    return {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <RadioGroup
          key={`radiogroup-${index}`}
          label={label}
          options={options}
          defaultValue={defaultValue}
          name={name}
          labelFontVariant={labelFontVariant}
          labelFontColor={labelFontColor}
          labelText={labelText}
          {...restProps}
        />
      ),
    }
  }

  if (Array.isArray(grid.radiogroup)) {
    return grid.radiogroup.map(renderRadioGroup)
  } else {
    return renderRadioGroup(grid.radiogroup, 0)
  }
}

export default useGridRadioGroup
