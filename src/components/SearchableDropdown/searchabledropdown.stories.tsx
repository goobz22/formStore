// src/components/SearchableDropdown/searchabledropdown.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import SearchableDropdown from './index'
import { SearchableDropdownProps } from './index'

/**
 * Reusable list of options for demonstration.
 */
const sampleOptions = [
  { value: 'apple', attribute1: 'Fruit', attribute2: 'Green or Red' },
  { value: 'banana', attribute1: 'Fruit', attribute2: 'Yellow' },
  { value: 'carrot', attribute1: 'Vegetable', attribute2: 'Orange' },
  { value: 'potato', attribute1: 'Vegetable', attribute2: 'Brown' },
  { value: 'avocado', attribute1: 'Fruit', attribute2: 'Green' },
  { value: 'broccoli', attribute1: 'Vegetable', attribute2: 'Green' },
]

/**
 * Storybook metadata
 */
const meta: Meta<typeof SearchableDropdown> = {
  title: 'Components/SearchableDropdown',
  component: SearchableDropdown,
  argTypes: {
    backgroundcolor: { control: 'color' },
    outlinecolor: { control: 'color' },
    fontcolor: { control: 'color' },
    inputfontcolor: { control: 'color' },
    shrunkfontcolor: { control: 'color' },
    unshrunkfontcolor: { control: 'color' },
    placeholdercolor: { control: 'color' },
  },
}
export default meta

type Story = StoryObj<typeof SearchableDropdown>

/**
 * 1) Basic usage
 */
export const Basic: Story = {
  args: {
    label: 'Basic SearchableDropdown',
    options: sampleOptions,
    placeholder: 'Start typing...',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)

    // Check for the label
    expect(canvas.getByText('Basic SearchableDropdown')).toBeInTheDocument()

    // Click the input
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)

    // Attempt to type a partial match
    await userEvent.type(input, 'car')
    // 'carrot' should appear among the options
    expect(canvas.getByText('carrot')).toBeInTheDocument()
  },
}

/**
 * 2) With defaultValue
 */
export const WithDefaultValue: Story = {
  args: {
    label: 'Dropdown with Default Value',
    options: sampleOptions,
    defaultValue: 'banana',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    // Expect the input to show the default item
    const input = canvas.getByRole('combobox') as HTMLInputElement
    expect(input.value).toMatch(/banana/i)
  },
}

/**
 * 3) Options with Complex Attributes
 */
export const ComplexAttributes: Story = {
  args: {
    label: 'Complex Attributes',
    options: [
      {
        value: 'item1',
        attribute1: 'Extra data #1',
        attribute2: 'More info #1',
      },
      {
        value: 'item2',
        attribute1: 'Extra data #2',
        attribute2: 'More info #2',
      },
      {
        value: 'item3',
        attribute1: 'Extra data #3',
        attribute2: 'More info #3',
      },
    ],
    placeholder: 'Search items...',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    // Try opening the dropdown
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    // item1, item2, item3 should be visible
    expect(canvas.getByText('item1')).toBeInTheDocument()
    expect(canvas.getByText('item3')).toBeInTheDocument()
  },
}

/**
 * 4) Error State
 */
export const ErrorState: Story = {
  args: {
    label: 'Error Dropdown',
    options: sampleOptions,
    error: true,
    helperText: 'Something went wrong!',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Confirm the helper text
    expect(canvas.getByText('Something went wrong!')).toBeInTheDocument()
  },
}

/**
 * 5) Required Dropdown
 */
export const RequiredField: Story = {
  args: {
    label: 'Required Dropdown',
    options: sampleOptions,
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Check that label is present
    expect(canvas.getByText('Required Dropdown')).toBeInTheDocument()
  },
}

/**
 * 6) Custom Colors
 */
export const CustomColors: Story = {
  args: {
    label: 'Custom Colors',
    options: sampleOptions,
    backgroundcolor: '#f0f8ff',
    outlinecolor: '#ff5722',
    fontcolor: '#4caf50',
    inputfontcolor: '#e91e63',
    shrunkfontcolor: '#673ab7',
    unshrunkfontcolor: '#9c27b0',
    placeholdercolor: '#42a5f5',
    placeholder: 'Enter something...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Interact just to ensure no errors
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    expect(input).toBeInTheDocument()
  },
}

/**
 * 7) Searching & Selecting
 */
export const SearchAndSelect: Story = {
  args: {
    label: 'Search & Select',
    options: sampleOptions,
    placeholder: 'Find an item...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Focus and type a partial search
    const input = canvas.getByRole('combobox') as HTMLInputElement
    await userEvent.click(input)
    await userEvent.type(input, 'avo')

    // 'avocado' should appear
    const avocadoOption = canvas.getByText('avocado')
    expect(avocadoOption).toBeInTheDocument()

    // Click the option
    await userEvent.click(avocadoOption)

    // Now the input value should be "avocado"
    expect(input.value).toMatch(/avocado/i)
  },
}

/**
 * 8) No Options scenario
 */
export const NoOptions: Story = {
  args: {
    label: 'Empty Dropdown',
    options: [],
    placeholder: 'No items available...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Open the dropdown
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    // No items should appear
    expect(canvas.queryByText('apple')).not.toBeInTheDocument()
  },
}