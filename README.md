# react-hotkeys

> Package for create and handle hotkeys for React.JS

[![NPM](https://img.shields.io/npm/v/react-hotkeys.svg)](https://www.npmjs.com/package/react-hotkeys) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @code_of_power/react-hotkeys
```

## Base usage

```tsx
import React, { FC } from 'react'
import { HotkeyZone, IHotkeyEvent, IHotkeyRegistry, Key } from 'react-hotkeys'

enum E_ACTIONS {
  CTRL_ALT_L = 'CTRL_ALT_L',
  M = 'M'
}

const HOTKEYS: IHotkeyRegistry[] = [
  {
    action: E_ACTIONS.CTRL_ALT_L,
    keys: [[Key.Ctrl, Key.Alt, Key.L]]
  },
  {
    action: E_ACTIONS.M,
    keys: [[Key.M]]
  }
]

const Example: FC = () => {
  const hotkeyHnd = useCallback(
    (e: IHotkeyEvent<E_ACTIONS>) => console.warn(e),
    []
  )

  return (
    <HotkeyZone hotkeys={HOTKEYS} onHotkeyEvent={hotkeyHnd} zone='my-zone'>
      <div tabIndex={1}></div>
    </HotkeyZone>
  )
}
```

More examples in live on [codesandbox](https://codesandbox.io/s/polished-field-12ufy?file=/src/App.tsx).

## License

MIT © [Code of Power](https://github.com/Code-of-Power)

## Donate

You can support our develops.

Financial support will help us focus more on open source projects. Thanks for your [donate](https://www.tinkoff.ru/collectmoney/crowd/kernichnyi.andrey1/yHjhT34489/?short_link=1idYUIkwUmR&httpMethod=GET)!

Happy coding!
