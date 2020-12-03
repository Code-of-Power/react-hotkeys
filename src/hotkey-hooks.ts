import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { IHotkeyEvent, IHotkeyRegistry, IHotkeyService } from './interfaces'
import { HotkeyService } from './hotkey-service'
import { SRV_SYMBOL } from './constants'

const getHotkeySrv = () => {
  const win = window as any
  const hotkeysSrv = win[SRV_SYMBOL]
  if (hotkeysSrv) {
    return hotkeysSrv
  } else {
    win[SRV_SYMBOL] = new HotkeyService()
    return win[SRV_SYMBOL]
  }
}

/**
 * Return instance of IHotkeyService
 */
export const useHotkeysSrv = (): IHotkeyService =>
  useMemo(() => getHotkeySrv(), [])

const _useHotkeySrv = (): HotkeyService => useMemo(() => getHotkeySrv(), [])

export const useHandleEvents = (
  zone: string,
  hotkeys: IHotkeyRegistry[],
  hnd: (e: IHotkeyEvent) => void
) => {
  const [haveEvent, setHaveEvent] = useState(false)
  const hotkeySrv = _useHotkeySrv()
  useEffect(() => {
    hotkeySrv.registryKeysSet(hotkeys.map((hk) => ({ ...hk, zone })))
    hotkeySrv.addListenersForZone((e) => hnd(e), zone)
  }, [hotkeys, hotkeySrv, zone, hnd])

  const stopPropagation = useCallback(
    (event: IHotkeyEvent | undefined, e: Event) => {
      if (event && event.zone === zone) {
        e.stopPropagation()
      }
    },
    [zone]
  )
  // Keyboard
  const keyDownHnd = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const event = hotkeySrv.handleKeyPressing(e.nativeEvent, zone)
      if (event && event.zone === zone) {
        setHaveEvent(true)
        e.stopPropagation()
      }
    },
    [setHaveEvent, hotkeySrv, zone]
  )
  const keyUpHnd = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      hotkeySrv.handleKeyUp(e.nativeEvent)
      if (haveEvent) {
        setHaveEvent(false)
        e.stopPropagation()
      }
    },
    [setHaveEvent, hotkeySrv, haveEvent]
  )
  // Mouse
  const wheelHnd = useCallback(
    (e) => {
      const event = hotkeySrv.handleWheel(e, zone)
      stopPropagation(event, e)
    },
    [stopPropagation, zone, hotkeySrv]
  )
  const clickHnd = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const event = hotkeySrv.handleClick(e.nativeEvent, zone)
      stopPropagation(event, e.nativeEvent)
    },
    [stopPropagation, hotkeySrv, zone]
  )
  const dbClickHnd = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const event = hotkeySrv.handleDbClick(e.nativeEvent, zone)
      stopPropagation(event, e.nativeEvent)
    },
    [stopPropagation, hotkeySrv, zone]
  )
  const mouseDownHnd = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const event = hotkeySrv.handleMouseDown(e.nativeEvent, zone)
      if (event && event.zone === zone) {
        setHaveEvent(true)
        e.stopPropagation()
      }
    },
    [setHaveEvent, zone, hotkeySrv]
  )
  const mouseUpHnd = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      hotkeySrv.handleMouseUp(e.nativeEvent)
      if (haveEvent) {
        setHaveEvent(false)
        e.stopPropagation()
      }
    },
    [setHaveEvent, hotkeySrv, haveEvent]
  )

  return {
    keyDownHnd,
    keyUpHnd,
    wheelHnd,
    clickHnd,
    dbClickHnd,
    mouseDownHnd,
    mouseUpHnd
  }
}
