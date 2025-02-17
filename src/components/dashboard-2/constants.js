export const HAWAII = 'HAWAII'
export const HONOLULU = 'HONOLULU'
export const MAUI = 'MAUI'
export const KAUAI = 'KAUAI'
export const COUNTY_PENDING = 'COUNTY_PENDING'
export const OUTSIDE_HI = 'OUTSIDE_HI'

export const Colors = {
  HAWAII: 'rgb(78, 173, 128)',
  HONOLULU: 'rgb(91, 177, 177)',
  MAUI: 'rgb(211, 107, 72)',
  KAUAI: 'rgb(225, 180, 77)',
  COUNTY_PENDING: 'rgb(167, 111, 151)',
  OUTSIDE_HI: 'rgb(68, 110, 157)'
}

export const CUMULATIVE_CASES = 'CUMULATIVE_CASES'
export const NEW_CASES = 'NEW_CASES'
export const CUMULATIVE_RECOVERED = 'CUMULATIVE_RECOVERED'
export const NEW_RECOVERED = 'NEW_RECOVERED'
export const CUMULATIVE_HOSPITALIZATIONS = 'CUMULATIVE_HOSPITALIZATIONS'
export const NEW_HOSPITALIZATIONS = 'NEW_HOSPITALIZATIONS'
export const CUMULATIVE_DEATHS = 'CUMULATIVE_DEATHS'
export const NEW_DEATHS = 'NEW_DEATHS'

export const OPTIONS = [
  [CUMULATIVE_CASES, 'Cumulative Cases'],
  [NEW_CASES, 'New Cases'],
  [CUMULATIVE_RECOVERED, 'Cumulative Recovered'],
  [NEW_RECOVERED, 'New Recovered'],
  [CUMULATIVE_HOSPITALIZATIONS, 'Cumulative Hospitalizations'],
  [NEW_HOSPITALIZATIONS, 'New Hospitalizations'],
  [CUMULATIVE_DEATHS, 'Cumulative Deaths'],
  [NEW_DEATHS, 'New Deaths']
]

export const ColIdx = {
  REGION: 0,
  DATE: 1,
  CASES_TOT: 2,
  CASES_NEW: 3,
  CHANGE_P: 4,
  RATE: 5,
  RECOVERED_TOT: 6,
  RECOVERED_NEW: 7,
  HOSPITALIZED_TOT: 8,
  HOSPITALIZED_NEW: 9,
  DEATHS_TOT: 10,
  DEATHS_NEW: 11
}

export const COLUMN_INDEX_MAP = {
  CUMULATIVE_CASES: ColIdx.CASES_TOT,
  NEW_CASES: ColIdx.CASES_NEW,
  CUMULATIVE_RECOVERED: ColIdx.RECOVERED_TOT,
  NEW_RECOVERED: ColIdx.RECOVERED_NEW,
  CUMULATIVE_HOSPITALIZATIONS: ColIdx.HOSPITALIZED_TOT,
  NEW_HOSPITALIZATIONS: ColIdx.HOSPITALIZED_NEW,
  CUMULATIVE_DEATHS: ColIdx.DEATHS_TOT,
  NEW_DEATHS: ColIdx.DEATHS_NEW
}

export const ChartSize = {
  get WIDTH() {
    return Math.min(852, window.innerWidth)
  },
  get HEIGHT() {
    return 148.5
  }
}
