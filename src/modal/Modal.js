/* eslint-disable jsx-a11y/alt-text */
import './style.scss'

import React, { Component } from 'react'
import { Portal } from 'react-portal'
import classNames from 'classnames'

type Props = {
  className: String,
  title: String,
  buttons: any,
  children: any,
  onClose: Function
}

type State = {}

export default class Modal extends Component<Props, State> {
  state = {}

  onBackgroundClick = (e: Event) => {
    if (e.target === e.currentTarget) {
      this.props.onClose()
    }
  }

  render() {
    const { className, title, buttons, children } = this.props
    const { atTop, atBottom } = this.state

    return (
      <Portal>
        <div
          className={classNames('Modal', className)}
          onClick={this.onBackgroundClick}
        >
          <div className="modal-wrapper">
            {title ? <div className="modal-header">{title}</div> : null}
            <div
              className={classNames('modal-body', {
                'at-top': atTop,
                'at-bottom': atBottom
              })}
              onScroll={this.onScroll}
              ref={this.onRef}
            >
              {children}
            </div>
            <div className="modal-footer">{buttons}</div>
          </div>
        </div>
      </Portal>
    )
  }
}
