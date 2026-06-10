/**
 * kitchenService.test.ts — TDD (restaurant)
 */

import {
  KANBAN_COLUMNS,
  getBadgeColor,
  type KanbanColumn,
} from '@/lib/services/kitchenService'

// ─── KANBAN_COLUMNS ───────────────────────────────────────────────────────────

describe('KANBAN_COLUMNS', () => {
  it('debe tener exactamente 3 columnas', () => {
    expect(KANBAN_COLUMNS).toHaveLength(3)
  })

  it('la primera columna debe ser "pending"', () => {
    expect(KANBAN_COLUMNS[0].id).toBe('pending')
  })

  it('la segunda columna debe ser "progress"', () => {
    expect(KANBAN_COLUMNS[1].id).toBe('progress')
  })

  it('la tercera columna debe ser "done"', () => {
    expect(KANBAN_COLUMNS[2].id).toBe('done')
  })

  it('cada columna debe tener label, id y colorVar', () => {
    KANBAN_COLUMNS.forEach((col: KanbanColumn) => {
      expect(col.id).toBeTruthy()
      expect(col.label).toBeTruthy()
      expect(col.colorVar).toBeTruthy()
    })
  })

  it('los IDs deben ser únicos', () => {
    const ids = KANBAN_COLUMNS.map((c) => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('los labels deben ser únicos', () => {
    const labels = KANBAN_COLUMNS.map((c) => c.label)
    const uniqueLabels = new Set(labels)
    expect(uniqueLabels.size).toBe(labels.length)
  })
})

// ─── getBadgeColor ────────────────────────────────────────────────────────────

describe('getBadgeColor', () => {
  it('debe agregar el sufijo "25" de opacidad al color', () => {
    expect(getBadgeColor('var(--color-pending)')).toBe('var(--color-pending)25')
  })

  it('debe retornar un string', () => {
    expect(typeof getBadgeColor('var(--color-done)')).toBe('string')
  })

  it('debe funcionar con cualquier color CSS', () => {
    expect(getBadgeColor('#ff0000')).toBe('#ff000025')
  })
})
