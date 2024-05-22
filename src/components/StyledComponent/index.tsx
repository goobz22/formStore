import React, { useCallback, useState, useRef, useEffect } from 'react'
import { Box, InputLabel, OutlinedInput } from '@mui/material'
import { StyledComponentProps } from '../../types/styledcomponent'
import { useDropdown } from '../../hooks/styledcomponent/useDropdown'
import { usePhoneNumber } from '../../hooks/styledcomponent/usePhoneNumber'
import { usePassword } from '../../hooks/styledcomponent/usePassword'
import { Typography } from 'goobs-repo'
import { red, green } from '../../styles/palette'
import { formatPhoneNumber } from '../../utils/phone/format'
import { StartAdornment, EndAdornment } from './adornments'
import { useAtom } from 'jotai'
import { helperFooterAtom } from '../../atoms/helperfooter'
import { HelperFooterMessage } from '../../types/validation'
import { debounce } from 'lodash'
import labelStyles from '../../styles/StyledComponent/Label'

const StyledComponent: React.FC<StyledComponentProps> = props => {
  const {
    label,
    componentvariant,
    outlinecolor,
    inputRef,
    name,
    serverActionValidation,
    onChange,
    backgroundcolor,
    iconcolor,
    unshrunkfontcolor,
    combinedfontcolor,
    shrunkfontcolor,
    shrunklabellocation,
  } = props

  const [helperFooterResult, setHelperFooterResult] = useAtom(helperFooterAtom)
  const [isFocused, setIsFocused] = useState(false)
  const inputRefInternal = useRef<HTMLInputElement>(null)
  const inputBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.value && inputRefInternal.current) {
      inputRefInternal.current.focus()
    }
  }, [props.value])

  const { handleDropdownClick, renderMenu, selectedOption, isDropdownOpen } =
    useDropdown(props, inputBoxRef)

  const { handlePhoneNumberChange } = usePhoneNumber(props)

  const { passwordVisible, togglePasswordVisibility } = usePassword()

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e)
      }

      if (componentvariant === 'phonenumber') {
        const formattedValue = formatPhoneNumber(e.target.value)
        const formattedEvent = {
          ...e,
          target: {
            ...e.target,
            value: formattedValue,
          },
        }
        handlePhoneNumberChange(formattedEvent)
      }

      if (serverActionValidation && name) {
        const formData = new FormData()
        formData.append(e.target.name, e.target.value)

        const debouncedServerActionValidation = debounce(async () => {
          if (serverActionValidation && name) {
            const validationResult = await serverActionValidation(formData)
            if (validationResult) {
              setHelperFooterResult(prevState => ({
                ...prevState,
                [name]: validationResult as HelperFooterMessage,
              }))
            }
          }
        }, 1000)

        debouncedServerActionValidation()
      }
    },
    [
      componentvariant,
      onChange,
      handlePhoneNumberChange,
      serverActionValidation,
      name,
      setHelperFooterResult,
    ]
  )

  const currentHelperFooter = name ? helperFooterResult[name] : undefined

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <Box
      // @ts-ignore
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
      <InputLabel
        style={labelStyles({
          componentvariant,
          unshrunkfontcolor,
          shrunkfontcolor,
          shrunklabellocation,
          combinedfontcolor,
          focused: isFocused || !!props.value,
        })}
        shrink={isFocused || !!props.value}
      >
        {label}
      </InputLabel>
      <Box ref={inputBoxRef} sx={{ width: '100%', paddingTop: '5px' }}>
        <OutlinedInput
          ref={inputRef || inputRefInternal}
          onClick={handleDropdownClick}
          style={{
            backgroundColor: backgroundcolor || 'inherit',
            width: '100%',
            height: 40,
            cursor: componentvariant === 'dropdown' ? 'pointer' : 'text',
            boxSizing: 'border-box',
            borderRadius: 5,
            marginTop: 'auto',
          }}
          inputProps={{
            style: {
              width: '100%',
              color: combinedfontcolor || unshrunkfontcolor || 'inherit',
              height: '100%',
              cursor: componentvariant === 'dropdown' ? 'pointer' : 'text',
            },
            placeholder: props.placeholder || '',
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
              marginRight={props.endAdornmentMarginRight}
              iconcolor={iconcolor}
            />
          }
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          fullWidth
          multiline={componentvariant === 'multilinetextfield'}
          label={label}
          autoComplete={props.autoComplete}
          name={name}
          value={componentvariant === 'dropdown' ? selectedOption : props.value}
          readOnly={componentvariant === 'dropdown'}
          notched={isFocused || !!props.value}
        />
        {componentvariant === 'dropdown' && isDropdownOpen && renderMenu}
      </Box>
      {currentHelperFooter?.statusMessage && (
        <Typography
          variant="merrihelperfooter"
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
