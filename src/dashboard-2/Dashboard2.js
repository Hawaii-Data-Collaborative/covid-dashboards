import './style.scss'

import React, { Component } from 'react'
import moment from 'moment'
import gapiConfig from '../gapi.json'
import logo from '../assets/logo.jpg'
import { loadData, getModifiedDate } from '../data'
import {
  HAWAII,
  HONOLULU,
  MAUI,
  KAUAI,
  CUMULATIVE_CASES,
  NEW_CASES,
  CUMULATIVE_RECOVERED,
  NEW_RECOVERED,
  CUMULATIVE_HOSPITALIZATIONS,
  NEW_HOSPITALIZATIONS,
  CUMULATIVE_DEATHS,
  NEW_DEATHS,
  OPTIONS
} from './constants'

import Chart1 from './Chart1'
import Chart2 from './Chart2'
import Chart3 from './Chart3'

type Props = {}

type State = {
  rows: Object[],
  modifiedDate: Date,
  trend:
    | CUMULATIVE_CASES
    | NEW_CASES
    | CUMULATIVE_RECOVERED
    | NEW_RECOVERED
    | CUMULATIVE_HOSPITALIZATIONS
    | NEW_HOSPITALIZATIONS
    | CUMULATIVE_DEATHS
    | NEW_DEATHS,
  county: HAWAII | HONOLULU | MAUI | KAUAI,
  loading: Boolean
}

export default class Dashboard2 extends Component<Props, State> {
  attempts = 0

  state = {
    rows: [],
    modifiedDate: new Date(),
    trend: CUMULATIVE_CASES,
    county: HONOLULU,
    loading: true
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    if (process.env.NODE_ENV === 'development' && localStorage.state) {
      this.setState(JSON.parse(localStorage.state))
      return
    }

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
      const rows = await loadData(window.gapi, true)
      const modifiedDate = getModifiedDate(rows)
      const nextState = { rows, modifiedDate, loading: false }
      this.setState(nextState)
      localStorage.state = JSON.stringify(nextState)
    } catch (err) {
      console.error(err)
      this.setState({ loading: false })
      this.alert()
    }
  }

  alert = (msg = 'Error connecting to Google Sheets') => {
    alert(msg)
  }

  onTrendChange = e => {
    this.setState({ trend: e.target.value })
  }

  onCountyChange = e => {
    this.setState({ county: e.target.value })
  }

  render() {
    const { rows, trend, county, modifiedDate, loading } = this.state

    return (
      <div className="Dashboard2">
        {loading ? (
          <div className="center">Loading...</div>
        ) : (
          <main>
            <div className="container pt-2 pb-2">
              <div className="row mb-3">
                <div className="col align-self-center d-flex align-items-center justify-content-center">
                  <b>Trend for: </b>
                  <select
                    className="form-control form-control-sm trend-for"
                    value={trend}
                    onChange={this.onTrendChange}
                  >
                    {OPTIONS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col text-center">
                  <h1 className="mb-0">State Trends &amp; 5-day Averages</h1>
                  <h2>
                    *Bars represent daily values and line represents 5-day
                    averages
                  </h2>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col">
                  <div className="chart-wrapper d-flex justify-content-center">
                    <Chart1 rows={rows} trend={trend} />
                  </div>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col">
                  <div className="d-flex justify-content-center text-center">
                    <div>
                      <h1 className="mb-0">County Trends</h1>
                      <div className="d-flex align-items-center">
                        <b className="text-nowrap">Sort by county:</b>
                        <select
                          className="form-control form-control-sm county"
                          value={county}
                          onChange={this.onCountyChange}
                        >
                          <option value={HAWAII}>Hawaii</option>
                          <option value={HONOLULU}>Honolulu</option>
                          <option value={KAUAI}>Kauai</option>
                          <option value={MAUI}>Maui</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col">
                  <div className="chart-wrapper d-flex justify-content-center">
                    <Chart2 rows={rows} trend={trend} county={county} />
                  </div>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col text-center">
                  <h1>County 5-day Averages</h1>
                </div>
              </div>
              <div className="row mb-0">
                <div className="col">
                  <div className="chart-wrapper d-flex justify-content-center">
                    <Chart3 rows={rows} trend={trend} />
                  </div>
                </div>
              </div>
              <div className="row align-items-center justify-content-between">
                <div className="col">
                  {modifiedDate ? (
                    <span className="mtime">
                      Last Updated: {moment(modifiedDate).format('MMM DD')}
                    </span>
                  ) : null}
                </div>
                <div className="col flex-grow-0">
                  <div className="logo-wrapper">
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
          </main>
        )}
      </div>
    )
  }
}
