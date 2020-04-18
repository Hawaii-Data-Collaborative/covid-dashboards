import './style.scss'

import React, { Component } from 'react'
import moment from 'moment'
import Chart from 'chart.js'
import { loadData } from '../data'
import gapiConfig from '../gapi.json'
import logo from '../assets/logo.jpg'

const HAWAII = 'HAWAII'
const HONOLULU = 'HONOLULU'
const MAUI = 'MAUI'
const KAUAI = 'KAUAI'

const CUMULATIVE_CASES = 'CUMULATIVE_CASES'
const NEW_CASES = 'NEW_CASES'
const CUMULATIVE_RECOVERED = 'CUMULATIVE_RECOVERED'
const NEW_RECOVERED = 'NEW_RECOVERED'
const CUMULATIVE_HOSPITALIZATIONS = 'CUMULATIVE_HOSPITALIZATIONS'
const NEW_HOSPITALIZATIONS = 'NEW_HOSPITALIZATIONS'
const CUMULATIVE_DEATHS = 'CUMULATIVE_DEATHS'
const NEW_DEATHS = 'NEW_DEATHS'

const OPTIONS = [
  [CUMULATIVE_CASES, 'Cumulative Cases'],
  [NEW_CASES, 'New Cases'],
  [CUMULATIVE_RECOVERED, 'Cumulative Recovered'],
  [NEW_RECOVERED, 'New Recovered'],
  [CUMULATIVE_HOSPITALIZATIONS, 'Cumulative Hospitalizations'],
  [NEW_HOSPITALIZATIONS, 'New Hospitalizations'],
  [CUMULATIVE_DEATHS, 'Cumulative Deaths'],
  [NEW_DEATHS, 'New Deaths']
]

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

export default class Dashboard2 extends Component<Props, State> {
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

    deltaType: 0,

    loading: true
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    if (process.env.NODE_ENV === 'development' && localStorage.state) {
      this.setState(JSON.parse(localStorage.state))
      this.initCharts()
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
      const data = await loadData(window.gapi)
      this.setState({ ...data, loading: false })
      localStorage.state = JSON.stringify({ ...data, loading: false })
      this.initCharts()
    } catch (err) {
      console.error(err)
      this.setState({ loading: false })
      this.alert()
    }
  }

  alert = (msg = 'Error connecting to Google Sheets') => {
    alert(msg)
  }

  initCharts = () => {
    setTimeout(() => {
      this.initChart1()
      this.initChart2()
      this.initChart3()
    }, 150)
  }

  initChart1 = () => {
    const chart = new Chart('chart-1', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
  }

  initChart2 = () => {
    const chart = new Chart('chart-2', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
  }

  initChart3 = () => {
    const chart = new Chart('chart-3', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
  }

  render() {
    const { modifiedDate, loading } = this.state

    return (
      <div className="Dashboard2">
        {loading ? (
          <div className="center">Loading...</div>
        ) : (
          <main>
            <div className="container pt-2 pb-2">
              <div className="row mb-4">
                <div className="col align-self-center d-flex align-items-center justify-content-center">
                  <b>Trend for: </b>
                  <select className="form-control form-control-sm trend-for">
                    {OPTIONS.map(([k, v]) => (
                      <option key={k} value={v}>
                        {v}
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
                  <div>
                    <canvas id="chart-1" width="852" height="110"></canvas>
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
                        <select className="form-control form-control-sm county">
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
                  <canvas id="chart-2" width="852" height="130"></canvas>
                </div>
              </div>
              <div className="row mb-1">
                <div className="col text-center">
                  <h1>County 5-day Averages</h1>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col">
                  <canvas id="chart-3" width="852" height="110"></canvas>
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
