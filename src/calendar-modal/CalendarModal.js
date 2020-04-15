import './style.scss'

import React, { useState } from 'react'
import moment from 'moment'
import img from '../assets/calendar.png'
import Modal from '../modal/Modal'

type Props = {
  modifiedDate: Date
}

export default function CalendarModal(props: Props) {
  const { modifiedDate } = props
  const [show, setShow] = useState(false)

  const toggle = () => setShow(!show)

  if (!modifiedDate) {
    return null
  }

  const buttons = (
    <button className="btn btn-primary" onClick={toggle}>
      Close
    </button>
  )

  return (
    <>
      <img
        className="CalendarModal"
        src={img}
        alt="calendar"
        onClick={toggle}
      />
      {show ? (
        <Modal buttons={buttons} onClose={toggle}>
          Last modified {moment(modifiedDate).format('LL')}.
        </Modal>
      ) : null}
    </>
  )
}
