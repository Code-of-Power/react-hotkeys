import React, { FC, useCallback, useState } from 'react'
import { HotkeyZone, IHotkeyEvent, IHotkeyRegistry, Key } from 'react-hotkeys'

enum E_ACTIONS {
  CTRL_ALT_L = 'CTRL_ALT_L',
  CTRL_ALT_M = 'CTRL_ATL_M',
  M = 'm_key'
}

const HOTKEYS: IHotkeyRegistry[] = [
  {
    action: E_ACTIONS.CTRL_ALT_L,
    keys: [[Key.Ctrl, Key.Alt, Key.L]]
  },
  {
    action: E_ACTIONS.CTRL_ALT_M,
    keys: [[Key.Ctrl, Key.Alt, Key.M]]
  },
  {
    action: E_ACTIONS.M,
    keys: [[Key.M]]
  }
]

const OutHotkey: FC<{ action?: E_ACTIONS }> = ({ action }) => {
  switch (action) {
    case E_ACTIONS.CTRL_ALT_L:
      return <span>We use: Ctrl + Alt + L</span>
    case E_ACTIONS.CTRL_ALT_M:
      return <span>We use: Ctrl + Alt + M</span>
    case E_ACTIONS.M:
      return <span>We use: M</span>
    default:
      return <span />
  }
}

export const ZoneOfHotkey: FC = () => {
  const [hotkey, setHotkey] = useState<E_ACTIONS | undefined>()
  const hotkeyHnd = useCallback((e: IHotkeyEvent<E_ACTIONS>) => {
    setHotkey(e.action)
    console.warn(e)
    setTimeout(() => setHotkey(undefined), 3000)
  }, [])
  return (
    <HotkeyZone hotkeys={HOTKEYS} onHotkeyEvent={hotkeyHnd} zone='my-zone'>
      <div tabIndex={1}>
        In this div declared: "my-zone" hotkey zone and next hotkeys:
        <ul>
          <li>Ctrl + Alt + L</li>
          <li>Ctrl + Alt + M</li>
          <li>M (This M hotkey work for this zone)</li>
        </ul>
        <div>
          <OutHotkey action={hotkey} />
        </div>
      </div>
    </HotkeyZone>
  )
}
