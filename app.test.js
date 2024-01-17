const request = require('supertest')
const app = require('./app')
const server = app.server

test('getting the shop products', async () => {
  const res = await request(server).get('/api/burrito')
  const answer = [
    { name: 'Chicken Burrito', size: 'regular', price: 3 },
    { name: 'Chicken Burrito', size: 'xl', price: 5 },
    { name: 'Beef Burrito', size: 'regular', price: 4 },
    { name: 'Beef Burrito', size: 'xl', price: 6 },
    { name: 'Burrito Bowl', size: 'regular', price: 6 },
    { name: 'Burrito Bowl', size: 'xl', price: 8 },
  ]
  expect(res.body).toEqual(answer)
})

test('getting orders without any orders placed', async () => {
  const res = await request(server).get('/api/orders')
  expect(res.body).toEqual([])
})

test('placing an order for a regular chicken burrito', async () => {
  const query = { name: 'Chicken Burrito', size: 'regular', price: 3 }
  const res = await request(server)
    .post('/api/orders')
    .set('Content-type', 'application/json')
    .send(query)
  const answer = [
    {
      name: 'Chicken Burrito',
      size: 'regular',
      price: 3,
      id: 0,
    },
  ]
  expect(res.body).toEqual(answer)
})

test('placing an order for an xl burrito bowl', async () => {
  app.resetOrders()
  let query = { name: 'Burrito Bowl', size: 'xl', price: 8 }
  const res = await request(server)
    .post('/api/orders')
    .set('Content-type', 'application/json')
    .send(query)
  const answer = [
    {
      name: 'Burrito Bowl',
      size: 'xl',
      price: 8,
      id: 0,
    },
  ]
  expect(res.body).toEqual(answer)
})

test('placing multiple orders', async () => {
  app.resetOrders()
  let query = { name: 'Chicken Burrito', size: 'regular', price: 3 }
  await request(server)
    .post('/api/orders')
    .set('Content-type', 'application/json')
    .send(query)

  query = { name: 'Burrito Bowl', size: 'xl', price: 8 }
  const res = await request(server)
    .post('/api/orders')
    .set('Content-type', 'application/json')
    .send(query)
  let answer = [
    {
      name: 'Chicken Burrito',
      size: 'regular',
      price: 3,
      id: 0,
    },
    {
      name: 'Burrito Bowl',
      size: 'xl',
      price: 8,
      id: 1,
    },
  ]
  expect(res.body).toEqual(answer)
})

test('getting individual order from invalid id', async () => {
  app.resetOrders()
  let query = { name: 'Burrito Bowl', size: 'xl', price: 8 }
  let res = await request(server)
    .post('/api/orders')
    .set('Content-type', 'application/json')
    .send(query)

  query = { id: 1 }
  res = await request(server)
    .post('/api/orders/id')
    .set('Content-type', 'application/json')
    .send(query)
  expect(res.body).toEqual('Error: ID not found')
})

test('getting individual order from various ids', async () => {
  app.resetOrders()
  let query = { name: 'Chicken Burrito', size: 'regular', price: 3 }
  await request(server)
    .post('/api/orders')
    .set('Content-type', 'application/json')
    .send(query)

  query = { name: 'Beef Burrito', size: 'regular', price: 4 }
  await request(server)
    .post('/api/orders')
    .set('Content-type', 'application/json')
    .send(query)

  query = { name: 'Burrito Bowl', size: 'xl', price: 8 }
  await request(server)
    .post('/api/orders')
    .set('Content-type', 'application/json')
    .send(query)
  let answer = [
    {
      name: 'Chicken Burrito',
      size: 'regular',
      price: 3,
      id: 0,
    },
    {
      name: 'Beef Burrito',
      size: 'regular',
      price: 4,
      id: 1,
    },
    {
      name: 'Burrito Bowl',
      size: 'xl',
      price: 8,
      id: 2,
    },
  ]

  query = { id: 0 }
  let res = await request(server)
    .post('/api/orders/id')
    .set('Content-type', 'application/json')
    .send(query)
  expect(res.body).toEqual(answer[0])

  query = { id: 1 }
  res = await request(server)
    .post('/api/orders/id')
    .set('Content-type', 'application/json')
    .send(query)
  expect(res.body).toEqual(answer[1])

  query = { id: 2 }
  res = await request(server)
    .post('/api/orders/id')
    .set('Content-type', 'application/json')
    .send(query)
  expect(res.body).toEqual(answer[2])
})
