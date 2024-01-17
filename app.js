const express = require('express')
const app = express()
app.use(express.json())

/* Assuming the shop menu doesn't change, normally we would pull from the database
 * and have an api that allows the shop owner to write to database
 */
const shopBurritos = [
  { name: 'Chicken Burrito', size: 'regular', price: 3 },
  { name: 'Chicken Burrito', size: 'xl', price: 5 },
  { name: 'Beef Burrito', size: 'regular', price: 4 },
  { name: 'Beef Burrito', size: 'xl', price: 6 },
  { name: 'Burrito Bowl', size: 'regular', price: 6 },
  { name: 'Burrito Bowl', size: 'xl', price: 8 },
]

// Normally we would hook our orders up to some sort of database
let orders = []

// Used to reset orders for jest test cases
const resetOrders = () => {
  orders = []
}

// Returns the shop's burrito products
app.get('/api/burrito', (req, res, next) => {
  res.json(shopBurritos)
})

// Returns the list of orders
app.get('/api/orders', (req, res, next) => {
  res.json(orders)
})

// Submit an order
app.post('/api/orders', (req, res, next) => {
  // We assume the frontend passes the data correctly to the backend
  let order = req.body
  order.id = orders.length
  orders.push(order)
  res.json(orders)
})

// Takes in the order id and returns the order
app.post('/api/orders/id', (req, res, next) => {
  let id = req.body.id
  if (id <= orders.length - 1) {
    res.json(orders[id])
  } else {
    res.json('Error: ID not found')
  }
})

module.exports = { server: app.listen(3000), resetOrders }
