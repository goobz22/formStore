import React, { useState, useCallback } from 'react'

/**
 * Formats a string of digits into a US phone number format with a "+1" country code.
 *
 * @param {string} value - The input string to be formatted.
 * @returns {string} A formatted phone number string in the format "+1 xxx-xxx-xxxx".
 *
 * @example
 * formatPhoneNumber("1234567890") // returns "+1 123-456-7890"
 * formatPhoneNumber("12345") // returns "+1 123-45"
 */
export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  const limitedDigits = digits.slice(0, 10)
  let formattedNumber = '+1 '
  if (limitedDigits.length > 0) {
    formattedNumber += limitedDigits.slice(0, 3)
    if (limitedDigits.length > 3) {
      formattedNumber += '-' + limitedDigits.slice(3, 6)
      if (limitedDigits.length > 6) {
        formattedNumber += '-' + limitedDigits.slice(6)
      }
    }
  }
  return formattedNumber
}

/**
 * A custom React hook for managing and formatting a phone number input.
 *
 * @param {string} [initialValue=''] - The initial value of the phone number.
 * @returns {Object} An object containing the current phone number state and functions to update it.
 * @property {string} phoneNumber - The current formatted phone number.
 * @property {function} handlePhoneNumberChange - A function to handle changes to the phone number input.
 * @property {function} updatePhoneNumber - A function to directly update the phone number.
 *
 * @example
 * const { phoneNumber, handlePhoneNumberChange, updatePhoneNumber } = usePhoneNumber();
 */
export const usePhoneNumber = (initialValue: string = '') => {
  /**
   * The current state of the formatted phone number.
   * @type {[string, function]}
   */
  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber(initialValue)
  )

  /**
   * Handles changes to the phone number input.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event.
   */
  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const input = e.target.value
      // Remove the "+1 " prefix if it exists
      const strippedInput = input.startsWith('+1 ') ? input.slice(3) : input
      const formattedValue = formatPhoneNumber(strippedInput)
      setPhoneNumber(formattedValue)
    },
    []
  )

  /**
   * Updates the phone number state with a new value.
   *
   * @param {string} newValue - The new phone number value to set.
   */
  const updatePhoneNumber = useCallback((newValue: string) => {
    setPhoneNumber(formatPhoneNumber(newValue))
  }, [])

  return {
    phoneNumber,
    handlePhoneNumberChange,
    updatePhoneNumber,
  }
}
