import React, { FC, useCallback, useEffect, useState } from 'react'
import {
  useHotkeysSrv,
  IHotkeyRegistry,
  Key,
  IHotkeyEvent,
  E_MOUSE_KEYS
} from 'react-hotkeys'

enum E_HK_ACTION {
  UP = 'UP',
  M = 'M',
  WITH_MOUSE = 'WITH_MOUSE'
}

const CTRL_UP: IHotkeyRegistry<E_HK_ACTION> = {
  action: E_HK_ACTION.UP,
  keys: [[Key.UpArrow], [Key.W]]
}

const M: IHotkeyRegistry<E_HK_ACTION> = {
  action: E_HK_ACTION.M,
  keys: [[Key.M]]
}

const HK: IHotkeyRegistry<E_HK_ACTION> = {
  action: E_HK_ACTION.WITH_MOUSE,
  keys: [[Key.Space]],
  mouseKeys: [E_MOUSE_KEYS.LMB],
  mouseEvents: 'wheelup'
}

const OutHotkey: FC<{ action?: E_HK_ACTION }> = ({ action }) => {
  switch (action) {
    case E_HK_ACTION.UP:
      return <span>We use: Up/W</span>
    case E_HK_ACTION.M:
      return <span>We use: M</span>
    case E_HK_ACTION.WITH_MOUSE:
      return (
        <span>We use: Space + Left mouse button + Mouse wheel up event</span>
      )
    default:
      return <span />
  }
}

export const WithService: FC = () => {
  const hotkeySrv = useHotkeysSrv()
  const [hotkey, setHotkey] = useState<E_HK_ACTION | undefined>()
  const hotkeyHnd = useCallback((e: IHotkeyEvent<E_HK_ACTION>) => {
    setHotkey(e.action)
    console.warn(e)
    setTimeout(() => setHotkey(undefined), 3000)
  }, [])
  useEffect(() => {
    hotkeySrv.registryKeys(CTRL_UP)
    hotkeySrv.registryKeys(M)
    hotkeySrv.registryKeys(HK)
    hotkeySrv.addListener(hotkeyHnd)
  }, [hotkeySrv, hotkeyHnd])

  return (
    <div>
      <div>
        This component used HotkeyService for declare and use hotkeys in GLOBAL
        zone.
      </div>
      <div>In this div declared next hotkeys:</div>
      <ul>
        <li>Up/W (W - is alternate)</li>
        <li>M</li>
        <li>Space + Left mouse button + Mouse wheel up event</li>
      </ul>
      <div>
        <OutHotkey action={hotkey} />
      </div>
    </div>
  )
}
