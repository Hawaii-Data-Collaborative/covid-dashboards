import React, { Component } from 'react'
import moment from 'moment'
import _ from 'lodash'
import {
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line
} from 'recharts'

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
  OPTIONS,
  ChartSize
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

export default class Chart1 extends Component<Props, State> {
  getData = () => {
    const { trend, rows } = this.props
    const columnIndex = COLUMN_INDEX_MAP[trend]
    const stateRows = rows.filter(r => r[ColIdx.REGION] === 'State')

    const data = stateRows.map((r, i) => {
      const value = r[columnIndex]
      let date = new Date(r[ColIdx.DATE])
      if (!moment(date).isValid()) {
        date = null
      }

      let avg = null

      const group = [
        stateRows[i - 2],
        stateRows[i - 1],
        stateRows[i],
        stateRows[i + 1],
        stateRows[i + 2]
      ]

      if (group.every(Boolean)) {
        const values = group.map(r => r[columnIndex])
        if (values.every(s => (s || '').trim().length > 0)) {
          const sum = values.map(Number).reduce((a, b) => a + b, 0)
          avg = sum / values.length
        }
      }

      return {
        date,
        dateStr: date ? moment(date).format('MMM D') : '',
        avg,
        value
      }
    })

    return data
  }

  render() {
    const { trend } = this.props
    const data = this.getData()

    return (
      <ComposedChart
        width={ChartSize.WIDTH}
        height={ChartSize.HEIGHT}
        data={data}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="dateStr" />
        <YAxis />
        <Tooltip
          content={props => <CustomTooltip trend={trend} {...props} />}
        />
        <Bar dataKey="value" barSize={10} fill="rgb(180,180,180)" />
        <Line
          dot={false}
          type="monotone"
          dataKey="avg"
          stroke="rgb(180,180,180)"
          strokeWidth={2}
        />
      </ComposedChart>
    )
  }
}

function CustomTooltip(props: Object) {
  const { payload, trend } = props
  if (!payload.length) {
    return null
  }

  const data = payload[0].payload
  const value = data.value
  const avg = data.avg
  const dateStr = moment(data.date).format('M/D/Y')
  let label = ''
  const index = _.findIndex(OPTIONS, o => o[0] === trend)
  if (index > -1) {
    label = OPTIONS[index][1]
  }

  return (
    <div className="hdc-tooltip">
      <div>
        <label>Date</label>
        <span>{dateStr}</span>
      </div>
      <div>
        <label>{label}</label>
        <span>{value}</span>
      </div>
      {avg && (
        <div>
          <label>5-day Moving Average</label>
          <span>{avg}</span>
        </div>
      )}
    </div>
  )
}
