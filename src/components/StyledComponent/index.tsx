'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Box, InputLabel, OutlinedInput, styled } from '@mui/material'
import { useDropdown } from './hooks/useDropdown'
import { usePhoneNumber } from './hooks/usePhoneNumber'
import { useSplitButton } from './hooks/useSplitButton'
import { Typography } from './../Typography'
import { red, green } from '../../styles/palette'
import { StartAdornment, EndAdornment } from './adornment'
import {
  useHelperFooter,
  HelperFooterMessage,
} from './helperfooter/useHelperFooter'
import labelStyles from '../../styles/StyledComponent/Label'
import { useHasInputEffect, usePreventAutocompleteEffect } from './useEffects'

export interface StyledComponentProps {
  name?: string
  outlinecolor?: string
  iconcolor?: string
  backgroundcolor?: string
  notched?: boolean
  combinedfontcolor?: string
  unshrunkfontcolor?: string
  shrunkfontcolor?: string
  autoComplete?: string
  componentvariant?:
    | 'multilinetextfield'
    | 'dropdown'
    | 'searchbar'
    | 'textfield'
    | 'phonenumber'
    | 'password'
    | 'ip-address'
    | 'email'
    | 'url'
    | 'credit-card'
    | 'number'
    | 'hostname'
    | 'domain'
    | 'time'
    | 'date'
    | 'splitbutton'
  options?: readonly string[]
  defaultOption?: string
  helperfooter?: HelperFooterMessage
  placeholder?: string
  minRows?: number
  formname?: string
  label?: string
  shrunklabellocation?: 'onnotch' | 'above'
  value?: string
  valuestatus?: boolean
  focused?: boolean
  required?: boolean
  formSubmitted?: boolean
  'aria-label'?: string
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  onOptionSelect?: (option: string) => void
}

const NoAutofillOutlinedInput = styled(OutlinedInput)(() => ({
  '& .MuiInputBase-input': {
    '&:-webkit-autofill': {
      transition: 'background-color 600000s 0s, color 600000s 0s',
    },
    '&:-webkit-autofill:hover': {
      transition: 'background-color 600000s 0s, color 600000s 0s',
    },
    '&:-webkit-autofill:focus': {
      transition: 'background-color 600000s 0s, color 600000s 0s',
    },
    '&:-webkit-autofill:active': {
      transition: 'background-color 600000s 0s, color 600000s 0s',
    },
  },
}))

const StyledComponent: React.FC<StyledComponentProps> = props => {
  const {
    label,
    componentvariant,
    name,
    backgroundcolor,
    iconcolor,
    unshrunkfontcolor,
    combinedfontcolor,
    shrunkfontcolor,
    shrunklabellocation,
    value,
    valuestatus,
    placeholder,
    required = false,
    formname,
    formSubmitted = false,
    'aria-label': ariaLabel,
    'aria-required': ariaRequired,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    onOptionSelect,
  } = props

  const { validateField, validateRequiredField, helperFooterValue } =
    useHelperFooter()
  const [isFocused, setIsFocused] = useState(false)
  const [hasInput, setHasInput] = useState(false)
  const [showError, setShowError] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const inputRefInternal = useRef<HTMLInputElement>(null)
  const inputBoxRef = useRef<HTMLDivElement>(null)

  const { renderMenu, selectedOption, handleDropdownClick } = useDropdown(
    props,
    inputBoxRef,
    onOptionSelect
  )
  const { handlePhoneNumberChange } = usePhoneNumber()
  const {
    value: splitButtonValue,
    handleIncrement,
    handleDecrement,
  } = useSplitButton(props)

  useHasInputEffect(value, valuestatus, setHasInput)
  usePreventAutocompleteEffect(inputRefInternal)

  useEffect(() => {
    if (required && formname && name && label) {
      validateRequiredField(required, formname, name, label)
    }
  }, [required, formname, name, label, validateRequiredField])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError(formSubmitted || hasInput)
    }, 1000)

    return () => clearTimeout(timer)
  }, [formSubmitted, hasInput])

  const currentHelperFooter = name ? helperFooterValue[name] : undefined

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (componentvariant === 'phonenumber') {
      handlePhoneNumberChange(e)
    } else if (componentvariant === 'splitbutton') {
      const numValue = e.target.value.replace(/[^0-9]/g, '')
      e.target.value = numValue
    }

    setHasInput(!!e.target.value)

    const formData = new FormData()
    formData.append(e.target.name, e.target.value)
    if (name && label && formname) {
      validateField(name, formData, label, required, formname)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (name && label && !hasInput && formname) {
      const formData = new FormData()
      formData.append(name, '')
      validateField(name, formData, label, required, formname)
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const isDropdownVariant = componentvariant === 'dropdown'
  const isSplitButtonVariant = componentvariant === 'splitbutton'
  const isNotchedVariant =
    !isDropdownVariant &&
    !isSplitButtonVariant &&
    shrunklabellocation !== 'above' &&
    !!label
  const hasPlaceholder = !!placeholder

  const shouldShrinkLabel =
    isFocused ||
    isDropdownVariant ||
    isSplitButtonVariant ||
    hasPlaceholder ||
    hasInput ||
    componentvariant === 'phonenumber'

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        position: 'relative',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: shrunklabellocation === 'above' ? '20px' : '5px',
        }}
      >
        {label && (
          <InputLabel
            style={labelStyles({
              componentvariant,
              unshrunkfontcolor,
              shrunkfontcolor,
              shrunklabellocation,
              combinedfontcolor,
              focused: shouldShrinkLabel,
            })}
            shrink={shouldShrinkLabel}
            htmlFor={name}
          >
            {label}
          </InputLabel>
        )}
        <Box ref={inputBoxRef} sx={{ width: '100%' }}>
          <NoAutofillOutlinedInput
            ref={inputRefInternal}
            style={{
              backgroundColor: backgroundcolor || 'inherit',
              width: '100%',
              height: 40,
              cursor: isSplitButtonVariant
                ? 'default'
                : isDropdownVariant
                  ? 'pointer'
                  : 'text',
              boxSizing: 'border-box',
              borderRadius: 5,
              marginTop: 'auto',
              paddingRight: 6,
            }}
            inputProps={{
              style: {
                width: '100%',
                color: combinedfontcolor || unshrunkfontcolor || 'inherit',
                height: '100%',
                cursor: isSplitButtonVariant
                  ? 'default'
                  : isDropdownVariant
                    ? 'pointer'
                    : 'text',
              },
              placeholder: placeholder || '',
              'aria-label': ariaLabel,
              'aria-invalid': ariaInvalid,
              'aria-required': ariaRequired,
              'aria-describedby':
                ariaDescribedBy || currentHelperFooter?.statusMessage
                  ? `${name}-helper-text`
                  : undefined,
            }}
            type={
              componentvariant === 'password' && !passwordVisible
                ? 'password'
                : 'text'
            }
            startAdornment={
              <StartAdornment
                componentvariant={componentvariant || ''}
                iconcolor={iconcolor}
              />
            }
            endAdornment={
              <EndAdornment
                componentvariant={componentvariant || ''}
                passwordVisible={passwordVisible}
                togglePasswordVisibility={togglePasswordVisibility}
                iconcolor={iconcolor}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
              />
            }
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={isDropdownVariant ? handleDropdownClick : undefined}
            fullWidth
            multiline={componentvariant === 'multilinetextfield'}
            label={label}
            autoComplete="off"
            name={name}
            value={
              isDropdownVariant
                ? selectedOption
                : isSplitButtonVariant
                  ? splitButtonValue
                  : value
            }
            readOnly={isDropdownVariant}
            notched={
              (isNotchedVariant && shouldShrinkLabel) ||
              ((isDropdownVariant || isSplitButtonVariant) &&
                shrunklabellocation !== 'above') ||
              hasPlaceholder ||
              componentvariant === 'phonenumber'
            }
          />
          {isDropdownVariant && renderMenu}
        </Box>
      </Box>
      {showError && currentHelperFooter?.statusMessage && (
        <Typography
          id={`${name}-helper-text`}
          fontvariant="merrihelperfooter"
          fontcolor={
            currentHelperFooter?.status === 'error'
              ? red.main
              : currentHelperFooter?.status === 'success'
                ? green.dark
                : undefined
          }
          marginTop={0.5}
          marginBottom={0}
          align="left"
          text={currentHelperFooter?.statusMessage}
        />
      )}
    </Box>
  )
}

export default StyledComponent
