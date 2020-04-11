import './style.scss'

import React, { Component } from 'react'
import { loadData } from '../data'
import gapiConfig from './gapi.json'
import bigIslandImg from '../assets/big-island'
import kauaiImg from '../assets/kauai'
import mauiImg from '../assets/maui'
import oahuImg from '../assets/oahu'

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
  deltaType: PERCENT | COUNT,
  showGoogleUi: Boolean,
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

    deltaType: COUNT,

    showGoogleUi: false,
    loading: true
  }

  async componentDidMount() {
    this.init()
    this.checkUrl()
  }

  checkUrl = () => {
    const params = new URLSearchParams(window.location.search)
    const showGoogleUi = params.get('gapi') === '1'
    this.setState({ showGoogleUi })
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

    const authorizeButton = document.getElementById('authorize_button')
    const signoutButton = document.getElementById('signout_button')
    const handleAuthClick = () => gapi.auth2.getAuthInstance().signIn()
    const handleSignoutClick = () => gapi.auth2.getAuthInstance().signOut()

    gapi.load('client:auth2', async () => {
      try {
        const [clientId, apiKey, discoveryDocs, scope] = gapiConfig

        await gapi.client.init({
          apiKey,
          clientId,
          discoveryDocs,
          scope
        })

        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
        if (authorizeButton) {
          authorizeButton.onclick = handleAuthClick
          signoutButton.onclick = handleSignoutClick
        }
      } catch (err) {
        console.error(err)
        this.alert()
      }
    })

    const updateSigninStatus = (isSignedIn) => {
      if (isSignedIn) {
        if (authorizeButton) {
          authorizeButton.style.display = 'none'
          signoutButton.style.display = 'block'
        }
        this.loadData()
      } else {
        if (authorizeButton) {
          authorizeButton.style.display = 'block'
          signoutButton.style.display = 'none'
        }
      }
    }
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
      deltaType,
      loading,
      showGoogleUi
    } = this.state

    return (
      <div className="App">
        {loading ? (
          <div className="center">Loading...</div>
        ) : (
          <>
            <header>
              <div className="container">
                <h1>Total Cumulative Cases in Hawaii</h1>
                <h2 style={{ marginBottom: 30 }}>
                  (Values in parentheses refer to change from yesterday)
                </h2>
              </div>
            </header>
            <main>
              <div className="container pb-5">
                <div className="row">
                  <div className="col">
                    <div className="stats large">
                      <div className="title">State</div>
                      <div className="count">{state.count}</div>
                      <div className="delta">
                        (Δ{' '}
                        {deltaType === PERCENT
                          ? `${state.deltaPercent}%`
                          : state.deltaCount}
                        )
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="stats">
                      <div className="title">Hawaii</div>
                      <div className="count">{bigIsland.count}</div>
                      <div className="delta">
                        (Δ{' '}
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
                  <div className="col">
                    <div className="stats">
                      <div className="title">Honolulu</div>
                      <div className="count">{oahu.count}</div>
                      <div className="delta">
                        (Δ{' '}
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
                  <div className="col other-numbers">
                    <div className="pending d-flex align-items-center">
                      <Circle />
                      <span>County Pending:</span>
                      <span>
                        {deltaType === PERCENT
                          ? `${pending.deltaPercent}%`
                          : pending.deltaCount}
                      </span>
                    </div>
                    <div className="hi-residents-outside d-flex align-items-center">
                      <Circle />
                      <span>HI residents diagnosed elsewhere:</span>
                      <span>
                        {deltaType === PERCENT
                          ? `${residentsOutsideHi.deltaPercent}%`
                          : residentsOutsideHi.deltaCount}
                      </span>
                    </div>
                    <div>Show Δ as:</div>
                    <div className="dropdown">
                      <select
                        className="form-control"
                        value={deltaType}
                        onChange={(e) =>
                          this.setState({ deltaType: e.target.value })
                        }
                      >
                        <option value={PERCENT}>Percent</option>
                        <option value={COUNT}>Count</option>
                      </select>
                    </div>
                  </div>
                  <div className="col">
                    <div className="stats">
                      <div className="title">Kauai</div>
                      <div className="count">{kauai.count}</div>
                      <div className="delta">
                        (Δ{' '}
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
                  <div className="col">
                    <div className="stats">
                      <div className="title">Maui</div>
                      <div className="count">{maui.count}</div>
                      <div className="delta">
                        (Δ{' '}
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
              </div>
            </main>
          </>
        )}

        {showGoogleUi ? (
          <div
            style={{
              border: '1px solid #ddd',
              maxWidth: 300,
              margin: 'auto',
              padding: 15,
              borderRadius: 2
            }}
          >
            <p style={{ textAlign: 'center' }}>Google API Setup</p>
            <button
              className="form-control"
              id="authorize_button"
              style={{ display: 'none' }}
            >
              Authorize
            </button>
            <button
              className="form-control"
              id="signout_button"
              style={{ display: 'none' }}
            >
              Sign Out
            </button>
          </div>
        ) : null}
      </div>
    )
  }
}

function Circle() {
  return (
    <svg
      width="14"
      height="14"
      version="1.1"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="7" r="7" fill="#2f547c" />
    </svg>
  )
}
