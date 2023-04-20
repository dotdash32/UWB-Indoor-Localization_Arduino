// InfluxDB API

const {InfluxDB, Point} = require('@influxdata/influxdb-client')

const token = 'D8VWmQrsMlo-Wv9pyszHxhUxmmbYSAX1i0BeDhisrmxdfxo-bzJVy-UX_wgDREAWOpQSPVcI9WjiGjpUFCgInA=='
const url = 'http://localhost:8086'

const client = new InfluxDB({url, token})

// Write Data

// let org = `AREC 22-23`
// let bucket = `TestData`

// let writeClient = client.getWriteApi(org, bucket, 'ns')

// for (let i = 0; i < 5; i++) {
//   let point = new Point('measurement1')
//     .tag('tagname1', 'tagvalue1')
//     .intField('field1', i)

//   void setTimeout(() => {
//     writeClient.writePoint(point)
//   }, i * 1000) // separate points by 1 second

//   void setTimeout(() => {
//     writeClient.flush()
//   }, 5000)
// }

// Query Data

let queryClient = client.getQueryApi(org)
let fluxQuery = `from(bucket: "TestData")
|> range(start: 2023-04-18T23:49:00Z)
|> filter(fn: (r) => r._field == "co" and r.sensor_id == "TLM0100")
|> last()`

queryClient.queryRows(fluxQuery, {
  next: (row, tableMeta) => {
    const tableObject = tableMeta.toObject(row)
    console.log(tableObject)
  },
  error: (error) => {
    console.error('\nError', error)
  },
  complete: () => {
    console.log('\nSuccess')
  },
})

// Expected Result:
/* {
  result: '_result',
  table: 0,
  _start: '2023-04-18T23:49:00Z',
  _stop: '2023-04-20T18:57:46.046615Z',
  _time: '2023-04-19T00:49:42Z',
  _value: 0.417848820317145,
  _field: 'co',
  _measurement: 'airSensors',
  sensor_id: 'TLM0100'
} */