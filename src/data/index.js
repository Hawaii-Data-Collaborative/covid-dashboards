export async function loadData(gapi: Object) {
  try {
    const res = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1gJYUMj8pIuQlFEu2v3gNQoD-IegDSzPD11HtoMNvjZ4',
      range: 'Sheet1!A1:E8'
    })

    const { values } = res.result
    if (!values.length) {
      throw new Error('No data found.')
    }

    const [
      // eslint-disable-next-line no-unused-vars
      headerRow,
      stateRow,
      bigIslandRow,
      oahuRow,
      kauaiRow,
      mauiRow,
      residentsOutsideHiRow,
      pendingRow
    ] = values

    return {
      state: processRow(stateRow),
      bigIsland: processRow(bigIslandRow),
      oahu: processRow(oahuRow),
      kauai: processRow(kauaiRow),
      maui: processRow(mauiRow),
      residentsOutsideHi: processRow(residentsOutsideHiRow),
      pending: processRow(pendingRow)
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}

function processRow(row: String[]) {
  const count = row[2]
  const deltaCount = row[3]
  const deltaPercent = row[4]
  return { count, deltaPercent, deltaCount }
}
