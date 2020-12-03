import React, { FC } from 'react'
import { useHandleEvents } from '../hotkey-hooks'
import { IHotkeyEvent, IHotkeyRegistry } from '../interfaces'

interface IHotkeyZoneProps {
  zone: string
  hotkeys: IHotkeyRegistry[]
  onHotkeyEvent: (e: IHotkeyEvent) => void
}
/**
 * Component for decalre zone of hotkeys
 */
export const HotkeyZone: FC<IHotkeyZoneProps> = ({
  children,
  hotkeys,
  zone,
  onHotkeyEvent
}) => {
  const {
    clickHnd,
    dbClickHnd,
    keyDownHnd,
    keyUpHnd,
    mouseDownHnd,
    mouseUpHnd,
    wheelHnd
  } = useHandleEvents(zone, hotkeys, onHotkeyEvent)

  return (
    <div
      onKeyDown={keyDownHnd}
      onKeyUp={keyUpHnd}
      onWheel={wheelHnd}
      onClick={clickHnd}
      onDoubleClick={dbClickHnd}
      onMouseDown={mouseDownHnd}
      onMouseUp={mouseUpHnd}
    >
      {children}
    </div>
  )
}
