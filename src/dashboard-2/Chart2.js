import React, { Component } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { CartesianGrid, XAxis, YAxis, Tooltip, Bar, BarChart } from 'recharts'

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
  HAWAII,
  HONOLULU,
  KAUAI,
  MAUI,
  OPTIONS,
  OUTSIDE_HI,
  COUNTY_PENDING,
  Colors,
  CHART_HEIGHT
} from './constants'

const Counties = {
  HAWAII: ['hawaii', Colors.HAWAII, 'Hawaii'],
  HONOLULU: ['honolulu', Colors.HONOLULU, 'Honolulu'],
  KAUAI: ['kauai', Colors.KAUAI, 'Kauai'],
  MAUI: ['maui', Colors.MAUI, 'Maui'],
  COUNTY_PENDING: ['countyPending', Colors.COUNTY_PENDING, 'County Pending'],
  OUTSIDE_HI: ['outsideHi', Colors.OUTSIDE_HI, 'Outside HI']
}

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
    | NEW_DEATHS,
  county: HAWAII | HONOLULU | MAUI | KAUAI
}

export default class Chart2 extends Component<Props, State> {
  getData = () => {
    const { trend, rows } = this.props
    const columnIndex = COLUMN_INDEX_MAP[trend]

    const groups = _.groupBy(rows, r => r[ColIdx.DATE])
    let data = []
    for (const [date, rows] of Object.entries(groups)) {
      if (date === 'Date') {
        continue
      }

      const hawaii = rows.find(r => r[ColIdx.REGION] === 'Hawaii')
      const honolulu = rows.find(r => r[ColIdx.REGION] === 'Honolulu')
      const maui = rows.find(r => r[ColIdx.REGION] === 'Maui')
      const kauai = rows.find(r => r[ColIdx.REGION] === 'Kauai')
      const countyPending = rows.find(
        r => r[ColIdx.REGION] === 'County Pending'
      )
      const outsideHi = rows.find(r => r[ColIdx.REGION] === 'Outside HI')

      const date2 = new Date(date)
      const dateStr = moment(date2).format('MMM D')

      const entry = {
        date: date2,
        dateStr,
        hawaii: hawaii ? Math.max(hawaii[columnIndex], 0) : null,
        honolulu: honolulu ? Math.max(honolulu[columnIndex], 0) : null,
        maui: maui ? Math.max(maui[columnIndex], 0) : null,
        kauai: kauai ? Math.max(kauai[columnIndex], 0) : null,
        countyPending: countyPending
          ? Math.max(countyPending[columnIndex], 0)
          : null,
        outsideHi: outsideHi ? Math.max(outsideHi[columnIndex], 0) : null
      }

      if (entry.hawaii !== null && isNaN(entry.hawaii)) entry.hawaii = 0
      if (entry.honolulu !== null && isNaN(entry.honolulu)) entry.honolulu = 0
      if (entry.maui !== null && isNaN(entry.maui)) entry.maui = 0
      if (entry.kauai !== null && isNaN(entry.kauai)) entry.kauai = 0
      if (entry.countyPending !== null && isNaN(entry.countyPending))
        entry.countyPending = 0
      if (entry.outsideHi !== null && isNaN(entry.outsideHi))
        entry.outsideHi = 0

      data.push(entry)
    }

    return data
  }

  render() {
    const { county, trend } = this.props
    const data = this.getData()

    const countyKeys = [
      HONOLULU,
      MAUI,
      HAWAII,
      KAUAI,
      COUNTY_PENDING,
      OUTSIDE_HI
    ]

    if (county !== HONOLULU) {
      const i = countyKeys.indexOf(county)
      countyKeys.splice(i, 1)
      countyKeys.unshift(county)
    }

    const bars = countyKeys.map(k => {
      const [key, color] = Counties[k]
      return <Bar key={key} dataKey={key} stackId="a" fill={color} />
    })

    return (
      <BarChart
        width={852}
        height={CHART_HEIGHT}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          content={props => (
            <CustomTooltip {...props} trend={trend} countyKeys={countyKeys} />
          )}
        />
        {bars}
      </BarChart>
    )
  }
}

function CustomTooltip(props: Object) {
  const { payload, trend, countyKeys } = props
  if (!payload.length) {
    return null
  }

  const data = payload[0].payload
  const dateStr = moment(data.date).format('M/D/Y')

  let uiFields = []
  for (const k of countyKeys) {
    // eslint-disable-next-line no-unused-vars
    const [key, color, label] = Counties[k]
    const value = data[key]
    uiFields.push({ value, label })
  }

  uiFields.reverse()

  return (
    <div className="hdc-tooltip">
      <div className="header">{OPTIONS.find(o => o[0] === trend)[1]}</div>
      <div>
        <label>Date</label>
        <span>{dateStr}</span>
      </div>
      {uiFields.map(({ value, label }, i) => (
        <div key={i}>
          <label>{label}</label>
          <span>{value}</span>
        </div>
      ))}
    </div>
  )
}
