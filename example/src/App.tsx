import React from 'react'
import { Form } from './components/Form'
import { ZoneOfHotkey } from './components/HotkeyZone'
import { WithService } from './components/WithService'

const App = () => {
  return (
    <div>
      <Form />
      <hr />
      <ZoneOfHotkey />
      <hr />
      <WithService />
    </div>
  )
}

export default App
