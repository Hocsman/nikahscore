import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNetworkStatus } from '../useNetworkStatus'

describe('useNetworkStatus', () => {
  beforeEach(() => {
    // Reset navigator.onLine to true
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })
  })

  it('état initial: isOnline = true, wasOffline = false', () => {
    const { result } = renderHook(() => useNetworkStatus())
    expect(result.current.isOnline).toBe(true)
    expect(result.current.wasOffline).toBe(false)
  })

  it('passe offline quand l\'événement offline est déclenché', () => {
    const { result } = renderHook(() => useNetworkStatus())

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current.isOnline).toBe(false)
  })

  it('passe online et marque wasOffline après retour en ligne', () => {
    const { result } = renderHook(() => useNetworkStatus())

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    expect(result.current.isOnline).toBe(false)

    act(() => {
      window.dispatchEvent(new Event('online'))
    })
    expect(result.current.isOnline).toBe(true)
    expect(result.current.wasOffline).toBe(true)
  })

  it('clearWasOffline remet wasOffline à false', () => {
    const { result } = renderHook(() => useNetworkStatus())

    // Simuler un cycle offline/online
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    act(() => {
      window.dispatchEvent(new Event('online'))
    })
    expect(result.current.wasOffline).toBe(true)

    act(() => {
      result.current.clearWasOffline()
    })
    expect(result.current.wasOffline).toBe(false)
  })

  it('nettoie les event listeners au unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useNetworkStatus())

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })
})
