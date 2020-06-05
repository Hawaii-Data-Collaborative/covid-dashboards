const REGION = 0
const DATE = 1
const TOTAL_CASES = 2
const NEW_CASES = 3
const CHANGE_P = 4
// const RATE = 4

export async function loadData(gapi: Object, raw: Boolean = false) {
  try {
    console.log('[loadData] loading spreadsheet')
    const res = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1sd-L317Je9ZhiQh3_uH9jTkl3ckc_o3sgrVauShcwCk',
      range: 'Data'
    })
    console.log('[loadData] loaded spreadsheet')

    const { values } = res.result
    if (!values.length) {
      throw new Error('No data found.')
    }

    if (raw) {
      return values
    }

    // Group the rows by region.
    const groups = {
      State: { data: [] },
      Hawaii: { data: [] },
      Honolulu: { data: [] },
      Kauai: { data: [] },
      Maui: { data: [] },
      'County Pending': { data: [] },
      'Outside HI': { data: [] }
    }

    for (const row of values) {
      if (!groups[row[REGION]]) {
        console.warn(`Unexpected region: ${row[REGION]}`)
        groups[row[REGION]] = { data: [] }
      }

      groups[row[REGION]].data.push(row)
    }

    let modifiedDate = new Date('2000-01-01')

    const processGroup = group => {
      const rows = [...group.data].reverse()
      for (const row of rows) {
        // Skip empty rows.
        if (row.length < 4) {
          continue
        }

        // Skip partially empty rows.
        if (!(row[REGION] && row[DATE] && row[TOTAL_CASES])) {
          continue
        }

        group.count = row[TOTAL_CASES]
        group.deltaCount = row[NEW_CASES] || '0'
        group.deltaPercent = row[CHANGE_P] || '0'

        const date = new Date(row[DATE])
        if (date.getTime() > modifiedDate.getTime()) {
          modifiedDate = date
        }

        // Break once we found the bottom-most rows with good data.
        break
      }
    }

    for (const group of Object.values(groups)) {
      processGroup(group)
    }

    return {
      state: groups.State,
      bigIsland: groups.Hawaii,
      oahu: groups.Honolulu,
      kauai: groups.Kauai,
      maui: groups.Maui,
      residentsOutsideHi: groups['Outside HI'],
      pending: groups['County Pending'],
      modifiedDate
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}

export function getModifiedDate(rows: Object[]) {
  rows = [...rows].reverse()
  let modifiedDate = new Date('2000-01-01')
  for (const row of rows) {
    // Skip empty rows.
    if (row.length < 4) {
      continue
    }

    // Skip partially empty rows.
    if (!(row[REGION] && row[DATE] && row[TOTAL_CASES])) {
      continue
    }

    const date = new Date(row[DATE])
    if (date.getTime() > modifiedDate.getTime()) {
      return date
    }
  }

  return null
}
