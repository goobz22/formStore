'use client'

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from 'react'
import type { ColumnDef } from '../types'
import { useAtomValue } from 'jotai'
import { columnVisibilityAtom } from '../Jotai/atom'

/**
 * A simple check to see if two arrays of ColumnDef differ
 * by comparing their `field` values in order.
 */
function arraysAreEqual(a: ColumnDef[], b: ColumnDef[]) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i].field !== b[i].field) return false
  }
  return true
}

interface UseComputeTableResizeParams {
  columns: ColumnDef[]
  checkboxSelection: boolean
  showOverflowDropdown: boolean
}

/**
 * Custom hook to handle table resizing logic:
 * - measuring text widths
 * - deciding which columns fit vs. overflow
 * - keeping track of the currently selected overflow column
 */
export function useComputeTableResize({
  columns,
  checkboxSelection,
  showOverflowDropdown,
}: UseComputeTableResizeParams) {
  // The ref to the container that we measure to decide how many columns can fit
  const containerRef = useRef<HTMLDivElement>(null)

  // The subset of columns that actually fit
  const [fittedDesktopColumns, setFittedDesktopColumns] = useState<ColumnDef[]>(
    []
  )
  // The subset of columns that overflow
  const [overflowDesktopColumns, setOverflowDesktopColumns] = useState<
    ColumnDef[]
  >([])
  // The field currently selected among the overflow columns
  const [selectedOverflowField, setSelectedOverflowField] = useState('')

  // We rely on Jotai for column visibility
  const columnVisibility = useAtomValue(columnVisibilityAtom)

  /**
   * measureTextWidth: Use a canvas to measure text length for column headers.
   */
  const measureTextWidth = useCallback((text: string, font = '14px Roboto') => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return 100
    ctx.font = font
    return ctx.measureText(text).width
  }, [])

  /**
   * measureColumnNeededWidth: For a given column, how many pixels does it need?
   */
  const measureColumnNeededWidth = useCallback(
    (col: ColumnDef): number => {
      // Force 60px for id or _id
      if (col.field === 'id' || col.field === '_id') {
        return 60
      }
      const header = col.headerName || col.field
      // +40 as a buffer for padding, sorting icons, etc.
      const baseWidth = measureTextWidth(header) + 40
      return col.width ?? baseWidth
    },
    [measureTextWidth]
  )

  /**
   * recalcColumns: Decide which columns fit & which overflow
   */
  const recalcColumns = useCallback(() => {
    if (!containerRef.current) return
    const containerWidth = containerRef.current.offsetWidth

    // Only consider columns that are visible
    const visibleCols = columns.filter(
      col => columnVisibility[col.field] !== false
    )

    let usedWidth = checkboxSelection ? 50 : 0
    // ~180 px for the "overflow" column if needed
    const overflowReservedWidth = showOverflowDropdown ? 180 : 0

    const canFit: ColumnDef[] = []
    let theOverflow: ColumnDef[] = []

    for (let i = 0; i < visibleCols.length; i++) {
      const col = visibleCols[i]
      const needed = measureColumnNeededWidth(col)

      if (usedWidth + needed + overflowReservedWidth <= containerWidth) {
        canFit.push(col)
        usedWidth += needed
      } else {
        // everything else is overflow
        theOverflow = visibleCols.slice(i)

        // If we can't fit i-th column, let's see if we can also move
        // the last fitted column to overflow
        if (theOverflow.length > 0 && canFit.length > 1) {
          const lastFitted = canFit.pop()
          if (lastFitted) {
            theOverflow = [lastFitted, ...theOverflow]
          }
        }
        break
      }
    }

    let newSelected = selectedOverflowField
    if (
      theOverflow.length > 0 &&
      !theOverflow.some(c => c.field === newSelected)
    ) {
      newSelected = theOverflow[0]?.field || ''
    } else if (theOverflow.length === 0 && newSelected !== '') {
      newSelected = ''
    }

    if (!arraysAreEqual(canFit, fittedDesktopColumns)) {
      setFittedDesktopColumns(canFit)
    }
    if (!arraysAreEqual(theOverflow, overflowDesktopColumns)) {
      setOverflowDesktopColumns(theOverflow)
    }
    if (newSelected !== selectedOverflowField) {
      setSelectedOverflowField(newSelected)
    }
  }, [
    containerRef,
    columns,
    columnVisibility,
    checkboxSelection,
    showOverflowDropdown,
    measureColumnNeededWidth,
    fittedDesktopColumns,
    overflowDesktopColumns,
    selectedOverflowField,
  ])

  // Observe container resizes
  useLayoutEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(() => {
      recalcColumns()
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [recalcColumns])

  // Also recalc on window resize for smoothness
  useEffect(() => {
    const handleResize = () => {
      recalcColumns()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [recalcColumns])

  // Recalc once on mount
  useEffect(() => {
    recalcColumns()
  }, [recalcColumns])

  return {
    containerRef,
    fittedDesktopColumns,
    overflowDesktopColumns,
    selectedOverflowField,
    setSelectedOverflowField,
  }
}