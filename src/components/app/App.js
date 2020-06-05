import './style.scss'

import React, { Component } from 'react'
import moment from 'moment'
import { loadData } from '../../data'
import gapiConfig from '../../gapi.json'
import bigIslandImg from '../../assets/big-island'
import kauaiImg from '../../assets/kauai'
import mauiImg from '../../assets/maui'
import oahuImg from '../../assets/oahu'
import logo from '../../assets/logo.jpg'
import DetailsModal from '../details-modal/DetailsModal'

const PERCENT = 'PERCENT'
const COUNT = 'COUNT'

type Props = {}

type State = {
  state: Object,
  bigIsland: Object,
  oahu: Object,
  kauai: Object,
  maui: Object,
  residentsOutsideHi: Object,
  pending: Object,
  modifiedDate: Date,
  deltaType: PERCENT | COUNT,
  loading: Boolean
}

export default class App extends Component<Props, State> {
  attempts = 0

  state = {
    state: {},
    bigIsland: {},
    oahu: {},
    kauai: {},
    maui: {},
    residentsOutsideHi: {},
    pending: {},
    modifiedDate: new Date(),

    deltaType: COUNT,

    loading: true
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    const gapi = window.gapi
    if (!gapi) {
      this.attempts++
      if (this.attempts > 3) {
        this.alert()
        return
      }

      setTimeout(this.init, 1000)
      return
    }

    gapi.load('client', async () => {
      console.log('[init] googleapi loaded')
      try {
        const [apiKey, discoveryDocs] = gapiConfig
        await gapi.client.init({ apiKey, discoveryDocs })
        console.log('[init] googleapi initialized')
        this.loadData()
      } catch (err) {
        console.error(err)
      }
    })
  }

  loadData = async () => {
    try {
      const data = await loadData(window.gapi)
      this.setState({ ...data, loading: false })
    } catch (err) {
      console.error(err)
      this.setState({ loading: false })
      this.alert()
    }
  }

  alert = (msg = 'Error connecting to Google Sheets') => {
    alert(msg)
  }

  render() {
    const {
      state,
      bigIsland,
      oahu,
      kauai,
      maui,
      residentsOutsideHi,
      pending,
      modifiedDate,
      deltaType,
      loading
    } = this.state

    return (
      <div className="App">
        {loading ? (
          <div className="center">Loading...</div>
        ) : (
          <main>
            <div className="container pt-2 pb-2">
              <div className="row">
                <div className="col col-12 col-md-5 pb-5 pb-md-0">
                  <div className="stats large">
                    <div className="title">State</div>
                    <div className="count">{state.count}</div>
                    <div className="delta">
                      (𝚫{' '}
                      {deltaType === PERCENT
                        ? `${state.deltaPercent}%`
                        : state.deltaCount}
                      )
                    </div>
                  </div>
                </div>
                <div className="col col-6 col-md-3">
                  <div className="stats">
                    <div className="title">Hawaii</div>
                    <div className="count">{bigIsland.count}</div>
                    <div className="delta">
                      (𝚫{' '}
                      {deltaType === PERCENT
                        ? `${bigIsland.deltaPercent}%`
                        : bigIsland.deltaCount}
                      )
                    </div>
                    <div className="photo">
                      <img src={bigIslandImg} alt="Hawaii" />
                    </div>
                  </div>
                </div>
                <div className="col col-6 col-md-3">
                  <div className="stats">
                    <div className="title">Honolulu</div>
                    <div className="count">{oahu.count}</div>
                    <div className="delta">
                      (𝚫{' '}
                      {deltaType === PERCENT
                        ? `${oahu.deltaPercent}%`
                        : oahu.deltaCount}
                      )
                    </div>
                    <div className="photo">
                      <img src={oahuImg} alt="Oahu" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col col-12 col-md-5 other-numbers d-flex flex-column align-items-sm-center pt-3 pt-sm-0">
                  <div className="pending d-flex">
                    <Circle color="rgb(167,111,151)" />
                    <div>
                      <span>County Pending:</span>
                      <span className="value">{pending.count}</span>
                    </div>
                  </div>
                  <div className="hi-residents-outside d-flex mt-sm-3 mb-2 mb-sm-4">
                    <Circle color="rgb(68,110,157)" />
                    <div style={{ whiteSpace: 'nowrap' }}>
                      <span>HI residents diagnosed elsewhere:</span>
                      <span className="value">{residentsOutsideHi.count}</span>
                    </div>
                  </div>
                  <div>Show 𝚫 as a:</div>
                  <div className="dropdown">
                    <select
                      className="form-control form-control-sm"
                      value={deltaType}
                      onChange={e =>
                        this.setState({ deltaType: e.target.value })
                      }
                    >
                      <option value={PERCENT}>Percent</option>
                      <option value={COUNT}>Count</option>
                    </select>
                  </div>
                  <div className="align-self-stretch d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <DetailsModal />
                      {modifiedDate ? (
                        <span className="mtime">
                          Last Updated: {moment(modifiedDate).format('MMM DD')}
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <div className="logo-wrapper d-md-none">
                        <a
                          href="https://hawaiidata.org"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            className="logo"
                            src={logo}
                            alt="Hawaii Data Collaborative"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col col-6 col-md-3">
                  <div className="stats">
                    <div className="title">Kauai</div>
                    <div className="count">{kauai.count}</div>
                    <div className="delta">
                      (𝚫{' '}
                      {deltaType === PERCENT
                        ? `${kauai.deltaPercent}%`
                        : kauai.deltaCount}
                      )
                    </div>
                    <div className="photo">
                      <img src={kauaiImg} alt="Kauai" />
                    </div>
                  </div>
                </div>
                <div className="col col-6 col-md-3">
                  <div className="stats">
                    <div className="title">Maui</div>
                    <div className="count">{maui.count}</div>
                    <div className="delta">
                      (𝚫{' '}
                      {deltaType === PERCENT
                        ? `${maui.deltaPercent}%`
                        : maui.deltaCount}
                      )
                    </div>
                    <div className="photo">
                      <img src={mauiImg} alt="Maui" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="logo-wrapper d-none d-md-block">
                <a
                  href="https://hawaiidata.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="logo"
                    src={logo}
                    alt="Hawaii Data Collaborative"
                  />
                </a>
              </div>
            </div>
          </main>
        )}
      </div>
    )
  }
}

function Circle({ color }) {
  return (
    <svg
      width="14"
      height="14"
      version="1.1"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="7" r="7" fill={color} />
    </svg>
  )
}
