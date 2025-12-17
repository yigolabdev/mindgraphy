import { useEffect, useCallback, useRef } from 'react'

interface UseKeyboardNavigationOptions {
  onEnter?: () => void
  onEscape?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: () => void
  onShiftTab?: () => void
  onSpace?: () => void
  enabled?: boolean
}

/**
 * 키보드 네비게이션 훅
 * 
 * 키보드 단축키를 쉽게 관리할 수 있게 해주는 훅
 * 
 * 사용 예시:
 * ```tsx
 * useKeyboardNavigation({
 *   onEnter: handleSubmit,
 *   onEscape: handleClose,
 *   onArrowDown: () => setFocusedIndex(prev => prev + 1),
 *   onArrowUp: () => setFocusedIndex(prev => prev - 1)
 * })
 * ```
 */
export function useKeyboardNavigation(options: UseKeyboardNavigationOptions) {
  const {
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    onShiftTab,
    onSpace,
    enabled = true
  } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // 입력 필드에서는 일부 키 이벤트 무시
      const target = event.target as HTMLElement
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)

      switch (event.key) {
        case 'Enter':
          if (onEnter && !event.shiftKey) {
            event.preventDefault()
            onEnter()
          }
          break
        case 'Escape':
          if (onEscape) {
            event.preventDefault()
            onEscape()
          }
          break
        case 'ArrowUp':
          if (onArrowUp && !isInput) {
            event.preventDefault()
            onArrowUp()
          }
          break
        case 'ArrowDown':
          if (onArrowDown && !isInput) {
            event.preventDefault()
            onArrowDown()
          }
          break
        case 'ArrowLeft':
          if (onArrowLeft && !isInput) {
            event.preventDefault()
            onArrowLeft()
          }
          break
        case 'ArrowRight':
          if (onArrowRight && !isInput) {
            event.preventDefault()
            onArrowRight()
          }
          break
        case 'Tab':
          if (event.shiftKey && onShiftTab) {
            event.preventDefault()
            onShiftTab()
          } else if (onTab) {
            event.preventDefault()
            onTab()
          }
          break
        case ' ':
          if (onSpace && !isInput) {
            event.preventDefault()
            onSpace()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab, onShiftTab, onSpace])
}

/**
 * 포커스 트랩 훅 (모달, 다이얼로그 등에서 사용)
 */
export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    
    // 초기 포커스
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [enabled])

  return containerRef
}

/**
 * 키보드 단축키 조합 훅
 */
interface KeyCombo {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  callback: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyCombo[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatches = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatches = shortcut.alt ? event.altKey : !event.altKey

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault()
          shortcut.callback()
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])
}

/**
 * 공통 키보드 단축키 상수
 */
export const KEYBOARD_SHORTCUTS = {
  SAVE: { key: 's', ctrl: true, label: 'Ctrl+S' },
  CANCEL: { key: 'Escape', label: 'Esc' },
  SUBMIT: { key: 'Enter', ctrl: true, label: 'Ctrl+Enter' },
  NEW: { key: 'n', ctrl: true, label: 'Ctrl+N' },
  SEARCH: { key: 'k', ctrl: true, label: 'Ctrl+K' },
  CLOSE: { key: 'Escape', label: 'Esc' },
  DELETE: { key: 'Delete', label: 'Delete' },
  EDIT: { key: 'e', ctrl: true, label: 'Ctrl+E' },
  REFRESH: { key: 'r', ctrl: true, label: 'Ctrl+R' },
  HELP: { key: '?', shift: true, label: '?' },
} as const

/**
 * 키보드 단축키 도움말 표시 훅
 */
export function useKeyboardHelp() {
  const showHelp = useCallback(() => {
    // TODO: 키보드 단축키 모달 표시
    console.log('Keyboard shortcuts help')
  }, [])

  useKeyboardShortcuts([
    { key: '?', shift: true, callback: showHelp }
  ])

  return { showHelp }
}
