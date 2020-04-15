import './style.scss'

import React, { useState } from 'react'
import img from '../assets/info.png'
import Modal from '../modal/Modal'

type Props = {}

export default function DetailsModal(props: Props) {
  const [show, setShow] = useState(false)

  const toggle = () => setShow(!show)

  const buttons = (
    <button className="btn btn-primary" onClick={toggle}>
      Close
    </button>
  )

  return (
    <>
      <div
        className="DetailsModal d-flex align-items-center justify-content-center"
        onClick={toggle}
      >
        <img src={img} alt="info" />
      </div>
      {show ? (
        <Modal buttons={buttons} onClose={toggle}>
          <p>
            Data is given by location of diagnosis and includes Hawaii residents
            and non-residents. Positive cases includes presumptive (positive
            test results from a private laboratory requiring confirmation by a
            state public health laboratory) and confirmed (meets CDC criteria
            and positive test result received from a certified laboratory).
          </p>
          <p>Source: Hawaii State DOH – Disease Outbreak Control Division</p>
        </Modal>
      ) : null}
    </>
  )
}
