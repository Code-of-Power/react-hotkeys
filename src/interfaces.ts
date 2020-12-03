import { Key } from 'ts-keycode-enum'

export type TMouseEvent =
  | 'click'
  | 'dbclick'
  | 'mousemove'
  | 'wheelup'
  | 'wheeldown'

/**
 * Descript hotkey for handle
 */
export interface IHotkeyRegistry<T = any> {
  mouseEvents?: TMouseEvent
  mouseKeys?: E_MOUSE_KEYS[]
  action: T
  keys: Key[][]
  zone?: string
}
/**
 * Descript hotkey event
 */
export interface IHotkeyEvent<T = any> {
  keys: Key[]
  action: T
  zone: string | 'GLOBAL'
}
/**
 * Keys of mouse
 */
export enum E_MOUSE_KEYS {
  /**
   * Left mouse button
   */
  LMB = 0,
  /**
   * Midle mouse button
   */
  MMB = 1,
  /**
   * Right mouse button
   */
  RMB = 2,
  /**
   * Back mouse button
   */
  BMB = 3,
  /**
   * Forvard mouse button
   */
  FMB = 4
}

export type Action = string | number

export type FindKeyCb = (
  keys: Key[][],
  mouseEvents?: TMouseEvent,
  mouseKeys?: E_MOUSE_KEYS[]
) => boolean

export interface IKeyData {
  data: IHotkeyRegistry
}
/**
 * Public interface of HotkeyService
 */
export interface IHotkeyService {
  addListener(cb: (e: IHotkeyEvent) => void): void
  removeListener(cb: (e: IHotkeyEvent) => void, zone?: string): void
  registryKeys(data: IHotkeyRegistry): void
  unregisterKeys(keyInfo: IHotkeyRegistry): void
  registryKeysSet(keysSet: IHotkeyRegistry[]): void
  unregisterKeysSet(keysSet: IHotkeyRegistry[]): void
}
