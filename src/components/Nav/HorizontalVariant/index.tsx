'use client'
import React, { useState, useEffect } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { get, set, JSONValue } from 'goobs-cache'
import { NavProps, SubNav, View } from '../index'

/**
 * Represents the possible alignment options for the horizontal navigation.
 */
type Alignment = 'left' | 'center' | 'right' | 'inherit' | 'justify'

/**
 * Represents the structure of an active tab value.
 */
export interface ActiveTabValue {
  /** The unique identifier of the active tab. */
  tabId: string
}

/**
 * Props for the HorizontalVariant component.
 */
export interface HorizontalVariantProps {
  /** An array of navigation items, sub-navigation items, or views. */
  items: (NavProps | SubNav | View)[]
  /** The height of the navigation bar. Defaults to '80px'. */
  height?: string
  /** The alignment of the navigation items. Defaults to 'left'. */
  alignment?: Alignment
  /** A unique name for this navigation component. Used for state management. */
  navname?: string
}

/**
 * HorizontalVariant component that renders a horizontal navigation bar.
 * It supports dynamic tab management, routing, and custom click handlers.
 *
 * @param {HorizontalVariantProps} props - The props for the HorizontalVariant component.
 * @returns {JSX.Element} The rendered HorizontalVariant component.
 */
function HorizontalVariant({
  items,
  height = '80px',
  alignment = 'left',
  navname,
}: HorizontalVariantProps) {
  /**
   * State to keep track of active tab values for different navigation components.
   */
  const [activeTabValues, setActiveTabValues] = useState<
    Record<string, ActiveTabValue | null>
  >({})

  /**
   * Effect hook to fetch and set the active tab values when the component mounts.
   */
  useEffect(() => {
    /**
     * Asynchronously fetches the active tab values from the cache.
     */
    const fetchActiveTabValues = async () => {
      const result = await get('activeTabValues', 'client')
      if (result && typeof result === 'object' && 'value' in result) {
        setActiveTabValues(
          (result as JSONValue).value as Record<string, ActiveTabValue | null>
        )
      }
    }

    fetchActiveTabValues()
  }, [])

  /**
   * Handles tab change events.
   * Updates the active tab values in the state and cache.
   *
   * @param {React.SyntheticEvent} event - The event object.
   * @param {string} newValue - The new value of the selected tab.
   */
  const handleTabChange = async (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    const updatedActiveTabValues = {
      ...activeTabValues,
      [navname ?? '']: { tabId: newValue },
    }
    setActiveTabValues(updatedActiveTabValues)
    await set(
      'activeTabValues',
      { type: 'json', value: updatedActiveTabValues } as JSONValue,
      new Date(Date.now() + 30 * 60 * 1000),
      'client'
    )
  }

  /**
   * Handles click events on individual tabs.
   * Supports different trigger types: route, onClick, and routeonhorizontal.
   *
   * @param {NavProps} tab - The tab object that was clicked.
   */
  const handleTabClick = (tab: NavProps) => {
    if (tab.trigger === 'route') {
      if (tab.route) {
        window.location.href = tab.route
      }
    } else if (tab.trigger === 'onClick') {
      if (tab.onClick) {
        tab.onClick()
      }
    } else if (tab.trigger === 'routeonhorizontal') {
      if (tab.route) {
        window.location.href = tab.route
      }
    }
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'black',
        display: 'flex',
        height: height,
        justifyContent: alignment,
        paddingLeft: '5px',
        paddingRight: '5px',
      }}
    >
      <Tabs
        value={activeTabValues?.[navname ?? '']?.tabId || false}
        onChange={handleTabChange}
        aria-label="nav tabs"
        sx={{
          height: height,
          '& .MuiTabs-flexContainer': {
            height: '100%',
          },
          '& .MuiTab-root': {
            height: '100%',
            minHeight: 'unset',
          },
        }}
      >
        {items.map((item: NavProps | SubNav | View) => {
          if ('orientation' in item) {
            const tab = item as NavProps
            return (
              <Tab
                key={tab.title}
                value={tab.title}
                label={tab.title}
                onClick={() => handleTabClick(tab)}
                sx={{
                  minHeight: 0,
                  textTransform: 'none',
                  border: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: 'black',
                  color: '#fff',
                  fontWeight: 500,
                  fontFamily: 'Merriweather',
                  fontSize: 16,
                  height: height,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '& .MuiTouchRipple-root': {
                    color: '#fff',
                  },
                  '&.Mui-selected': {
                    color: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#fff',
                  },
                  ...(tab.hasleftborder === 'true' && {
                    borderLeft: '1px solid white',
                  }),
                  ...(tab.hasrightborder === 'true' && {
                    borderRight: '1px solid white',
                  }),
                  width: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center',
                  px: 4,
                }}
              />
            )
          }
          return null
        })}
      </Tabs>
    </Box>
  )
}

export default HorizontalVariant
