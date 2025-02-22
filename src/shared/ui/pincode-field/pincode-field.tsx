import React, { useCallback, useRef } from 'react'

import cls from './pincode-field.module.css'

interface PincodeFieldProps {
  pin: string[]
  setPin: React.Dispatch<React.SetStateAction<string[]>>
}

export const PincodeField: React.FC<PincodeFieldProps> = ({ pin, setPin }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    setPin(prevPin => {
      const newPin = [...prevPin]

      newPin[index] = value.slice(-1)

      return newPin
    })
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [setPin])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }, [pin])

  return (
    <>
      <div className={cls.pinContainer}>
        {pin.map((digit, index) => (
          <input
          // eslint-disable-next-line react/no-array-index-key
            key={index}
            ref={el => {
              if (el) inputRefs.current[index] = el
            }}
            type="text"
            className={cls.pinInput}
            value={digit}
            maxLength={1}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
          />
        ))}
      </div>
    </>
  )
}
