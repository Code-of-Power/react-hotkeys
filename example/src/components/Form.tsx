import React, { FC } from 'react'
import { NoPropagation } from 'react-hotkeys'

export const Form: FC = () => {
  return (
    <form>
      <NoPropagation>
        <div>From this input native key event not propagation</div>
        <input type='text' name='form-input' id='form-input-0' />
      </NoPropagation>
    </form>
  )
}
