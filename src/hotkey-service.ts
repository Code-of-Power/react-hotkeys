/* tslint:disable:deprecation */
// tslint:disable: ban-types
import {
  IHotkeyRegistry,
  IHotkeyEvent,
  E_MOUSE_KEYS,
  Action,
  FindKeyCb,
  IKeyData,
  IHotkeyService
} from './interfaces'
import { Key } from 'ts-keycode-enum'
import { GLOBAL_ZONE_TOKEN } from './constants'

type HotkeyEventCb = (e: IHotkeyEvent) => void

export class HotkeyService implements IHotkeyService {
  private _zonesMap = new Map<string, Map<Action, IKeyData>>([
    [GLOBAL_ZONE_TOKEN, new Map()]
  ])
  private _currentDownKeys: Key[] = []
  private _currentMouseDownKeys = new Set<E_MOUSE_KEYS>([])

  private _listeners = new Map<string, HotkeyEventCb[]>([
    [GLOBAL_ZONE_TOKEN, []]
  ])

  constructor() {
    // Keyboard
    window.addEventListener('keydown', (e: KeyboardEvent) =>
      this.handleKeyPressing(e)
    )
    window.addEventListener('keyup', (e: KeyboardEvent) => this.handleKeyUp(e))
    // Mouse
    window.addEventListener('mouseout', () => (this._currentDownKeys = []))
    window.addEventListener('wheel', (e: WheelEvent) => this.handleWheel(e), {
      passive: false
    })
    window.addEventListener('click', (e: MouseEvent) => this.handleClick(e))
    window.addEventListener('dblclick', (e: MouseEvent) =>
      this.handleDbClick(e)
    )
    window.addEventListener('mousedown', (e: MouseEvent) =>
      this.handleMouseDown(e)
    )
    window.addEventListener('mouseup', (e: MouseEvent) => this.handleMouseUp(e))
  }

  public addListenersForZone(cb: HotkeyEventCb, zone: string) {
    const cbs = this._listeners.get(zone)
    Array.isArray(cbs) ? cbs.push(cb) : this._listeners.set(zone, [cb])
  }

  public addListener(cb: HotkeyEventCb) {
    const cbs = this._listeners.get(GLOBAL_ZONE_TOKEN) as HotkeyEventCb[]
    cbs.push(cb)
  }

  public removeListener(cb: (e: IHotkeyEvent) => void, zone?: string) {
    const cbs = this._listeners.get(GLOBAL_ZONE_TOKEN) as HotkeyEventCb[]
    this._listeners.set(
      zone || GLOBAL_ZONE_TOKEN,
      cbs.filter((lf) => lf !== cb)
    )
  }

  public registryKeys(data: IHotkeyRegistry) {
    const map = this._zonesMap.get(data.zone || GLOBAL_ZONE_TOKEN)
    if (map) {
      map.set(data.action, { data })
    } else {
      const actionMap = new Map()
      this._zonesMap.set(data.zone as string, actionMap)
      actionMap.set(data.action, { data })
    }
  }

  public unregisterKeys(keyInfo: IHotkeyRegistry) {
    this._zonesMap
      .get(keyInfo.zone || GLOBAL_ZONE_TOKEN)
      ?.delete(keyInfo.action)
  }

  public registryKeysSet(keysSet: IHotkeyRegistry[]) {
    keysSet.forEach((item) => this.registryKeys(item))
  }

  public unregisterKeysSet(keysSet: IHotkeyRegistry[]) {
    keysSet.forEach((item) => this.unregisterKeys(item))
  }

  private getEventByKeys(
    zone: string,
    cb: FindKeyCb
  ): IHotkeyEvent | undefined {
    const [action, inZone] = this._findHotkeyAction(zone, cb)
    if (action) {
      return {
        action,
        keys: [...this._currentDownKeys],
        zone: inZone
      }
    }
    return
  }

  public handleKeyPressing(
    e: KeyboardEvent,
    zone: string = GLOBAL_ZONE_TOKEN
  ): IHotkeyEvent | undefined {
    if (this._isPressedKey(e.keyCode)) {
      return
    }
    this._currentDownKeys.push(Key[Key[e.keyCode]])
    const event = this.getEventByKeys(
      zone,
      (k, m, mouseKeys) =>
        this._isCurKeySet(k) && (!mouseKeys || !mouseKeys.length) && !m
    )
    this._notify(e, event)
    return event
  }

  private _notify(e: Event, event: IHotkeyEvent | undefined) {
    if (event) {
      const cbs = this._listeners.get(
        event.zone || GLOBAL_ZONE_TOKEN
      ) as HotkeyEventCb[]
      cbs.forEach((lf) => lf(event))
      e.preventDefault()
    }
  }

  public handleKeyUp(e: KeyboardEvent) {
    this._currentDownKeys = this._currentDownKeys.filter(
      (key) => key !== Key[Key[e.keyCode]]
    )
  }

  public handleWheel(e: WheelEvent, zone: string = GLOBAL_ZONE_TOKEN) {
    let event: IHotkeyEvent | undefined
    if (e.deltaY < 0) {
      event = this.getEventByKeys(
        zone,
        (keys, mouseEvents, mouseKeys) =>
          this._isCurKeySet(keys) &&
          this._isCurMouseKeySet(mouseKeys) &&
          mouseEvents === 'wheelup'
      )
    } else {
      event = this.getEventByKeys(
        zone,
        (keys, mouseEvents, mouseKeys) =>
          this._isCurKeySet(keys) &&
          this._isCurMouseKeySet(mouseKeys) &&
          mouseEvents === 'wheeldown'
      )
    }
    this._notify(e, event)
    return event
  }

  public handleClick(e: MouseEvent, zone: string = GLOBAL_ZONE_TOKEN) {
    const event = this.getEventByKeys(
      zone,
      (keys, mouseEvent) => this._isCurKeySet(keys) && mouseEvent === 'click'
    )
    this._notify(e, event)
    return event
  }

  public handleDbClick(e: MouseEvent, zone: string = GLOBAL_ZONE_TOKEN) {
    const event = this.getEventByKeys(
      zone,
      (keys, mouseEvent, mouseKeys) =>
        this._isCurKeySet(keys) &&
        this._isCurMouseKeySet(mouseKeys) &&
        mouseEvent === 'dbclick'
    )
    this._notify(e, event)
    return event
  }

  public handleMouseDown(e: MouseEvent, zone: string = GLOBAL_ZONE_TOKEN) {
    this._currentMouseDownKeys = new Set([])
    ;[
      [1, E_MOUSE_KEYS.LMB],
      [2, E_MOUSE_KEYS.RMB],
      [4, E_MOUSE_KEYS.MMB],
      [8, E_MOUSE_KEYS.BMB],
      [16, E_MOUSE_KEYS.FMB]
    ].forEach(([v, b]) => {
      if (e.buttons >= v) {
        this._currentMouseDownKeys.add(b)
      }
    })
    const event = this.getEventByKeys(
      zone,
      (keys, mouseEvent, mouseKeys) =>
        this._isCurKeySet(keys) &&
        this._isCurMouseKeySet(mouseKeys) &&
        !mouseEvent
    )
    this._notify(e, event)
    return event
  }

  public handleMouseUp(e: MouseEvent) {
    this._currentMouseDownKeys.delete(e.button)
  }

  private _isPressedKey(keyCode: number) {
    return this._currentDownKeys.includes(keyCode)
  }

  private _findHotkeyAction(
    zone: string,
    cb: FindKeyCb
  ): [Action | undefined, string] {
    const foundAction = this._findAction(zone, cb)
    return foundAction !== undefined
      ? [foundAction, zone]
      : [this._findAction(GLOBAL_ZONE_TOKEN, cb), GLOBAL_ZONE_TOKEN]
  }

  private _isCurKeySet(keys: Key[][]) {
    return keys
      .map((keySet) =>
        keySet
          .map((key, idx) => this._currentDownKeys[idx] === key)
          .reduce((p, v) => p && v)
      )
      .reduce((p, v) => p || v)
  }

  private _isCurMouseKeySet(mouseKeys?: E_MOUSE_KEYS[]) {
    if (!mouseKeys && this._currentMouseDownKeys.size === 0) {
      return true
    }
    if (!mouseKeys || mouseKeys.length !== this._currentMouseDownKeys.size) {
      return false
    }
    return mouseKeys
      .map((mk) => this._currentMouseDownKeys.has(mk))
      .reduce((p, v) => p && v)
  }

  private _findAction(zone: string, cb: FindKeyCb) {
    let foundAction: Action | undefined
    const zoneMap = this._zonesMap.get(zone)
    if (zoneMap) {
      zoneMap.forEach(({ data: { mouseEvents, action, keys, mouseKeys } }) => {
        if (cb(keys, mouseEvents, mouseKeys)) {
          foundAction = action
        }
      })
    }
    return foundAction
  }
}
