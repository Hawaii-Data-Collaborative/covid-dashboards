import React, { Component } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { CartesianGrid, XAxis, YAxis, Tooltip, Line, LineChart } from 'recharts'

import {
  CUMULATIVE_CASES,
  NEW_CASES,
  CUMULATIVE_RECOVERED,
  NEW_RECOVERED,
  CUMULATIVE_HOSPITALIZATIONS,
  NEW_HOSPITALIZATIONS,
  CUMULATIVE_DEATHS,
  NEW_DEATHS,
  COLUMN_INDEX_MAP,
  ColIdx,
  Colors,
  OPTIONS,
  CHART_HEIGHT
} from './constants'

type Props = {
  rows: Object[][],
  trend:
    | CUMULATIVE_CASES
    | NEW_CASES
    | CUMULATIVE_RECOVERED
    | NEW_RECOVERED
    | CUMULATIVE_HOSPITALIZATIONS
    | NEW_HOSPITALIZATIONS
    | CUMULATIVE_DEATHS
    | NEW_DEATHS
}

export default class Chart3 extends Component<Props, State> {
  getData = () => {
    const { trend, rows } = this.props
    const columnIndex = COLUMN_INDEX_MAP[trend]

    let data = []
    for (const row of rows.slice(1)) {
      const county = row[ColIdx.REGION]
      const rawDate = row[ColIdx.DATE]
      const date = moment(new Date(rawDate))

      const row1 = rows.find(
        r =>
          r[ColIdx.REGION] === county &&
          r[ColIdx.DATE] === date.clone().add(-2, 'days').format('M/D/YY')
      )
      const row2 = rows.find(
        r =>
          r[ColIdx.REGION] === county &&
          r[ColIdx.DATE] === date.clone().add(-1, 'days').format('M/D/YY')
      )
      const row3 = rows.find(
        r =>
          r[ColIdx.REGION] === county &&
          r[ColIdx.DATE] === date.clone().add(1, 'days').format('M/D/YY')
      )
      const row4 = rows.find(
        r =>
          r[ColIdx.REGION] === county &&
          r[ColIdx.DATE] === date.clone().add(2, 'days').format('M/D/YY')
      )

      const group = [row1, row2, row, row3, row4]
      let avg = null

      if (group.every(Boolean)) {
        const values = group.map(r => r[columnIndex])
        if (values.every(s => (s || '').trim().length > 0)) {
          const sum = values.map(Number).reduce((a, b) => a + b, 0)
          avg = sum / values.length
        }
      }

      data.push({
        county,
        date: rawDate,
        avg
      })
    }

    const groups = _.groupBy(data, 'date')

    let data2 = []
    for (const [date, group] of Object.entries(groups)) {
      const hawaii = group.find(r => r.county === 'Hawaii')
      const honolulu = group.find(r => r.county === 'Honolulu')
      const maui = group.find(r => r.county === 'Maui')
      const kauai = group.find(r => r.county === 'Kauai')
      data2.push({
        date,
        hawaii: hawaii ? hawaii.avg : null,
        honolulu: honolulu ? honolulu.avg : null,
        maui: maui ? maui.avg : null,
        kauai: kauai ? kauai.avg : null
      })
    }

    return data2
  }

  render() {
    const { trend } = this.props
    const data = this.getData()

    return (
      <LineChart width={852} height={CHART_HEIGHT} data={data}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="dateStr" />
        <YAxis />
        <Tooltip
          content={props => <CustomTooltip trend={trend} {...props} />}
        />
        <Line
          dot={false}
          type="monotone"
          dataKey="hawaii"
          stroke={Colors.HAWAII}
          strokeWidth={2}
        />
        <Line
          dot={false}
          type="monotone"
          dataKey="honolulu"
          stroke={Colors.HONOLULU}
          strokeWidth={2}
        />
        <Line
          dot={false}
          type="monotone"
          dataKey="maui"
          stroke={Colors.MAUI}
          strokeWidth={2}
        />
        <Line
          dot={false}
          type="monotone"
          dataKey="kauai"
          stroke={Colors.KAUAI}
          strokeWidth={2}
        />
      </LineChart>
    )
  }
}

function CustomTooltip(props: Object) {
  const { trend, payload } = props
  if (!payload.length) {
    return null
  }

  const data = payload[0].payload
  const dateStr = moment(data.date).format('M/D/Y')
  const arr = [
    ['Honolulu', data.honolulu],
    ['Hawaii', data.hawaii],
    ['Maui', data.maui],
    ['Kauai', data.kauai]
  ]

  arr.sort((a, b) => a[1] - b[1]).reverse()

  return (
    <div className="hdc-tooltip">
      <div className="header">
        {OPTIONS.find(o => o[0] === trend)[1]} <br />
        5-day Moving Average
      </div>
      <div>
        <label>Date</label>
        <span>{dateStr}</span>
      </div>
      {arr.map(([label, value]) => (
        <div key={label}>
          <label>{label}</label>
          <span>{value}</span>
        </div>
      ))}
    </div>
  )
}
