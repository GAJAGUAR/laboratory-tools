/**
 * Specific Surface Calculator
 *
 */

"use strict"

// Sieve class
class Sieve {
  constructor(a, b) {
    this._opening = a
    this._passing = b
  }

  get opening() {
    return this._opening
  }

  get passing() {
    return this._passing
  }
}

// Sieve group class
// from sieve A to sieve B
class Group {
  constructor(a, b, c) {
    this._a = a // sieve a
    this._b = b // sieve b
    this._constant = c // specific surface constant
  }

  get from() {
    return this._a.opening
  }

  get to() {
    return this._b.opening
  }

  get constant() {
    return this._constant
  }

  get retained() {
    return round(this._a.passing - this._b.passing, 4)
  }

  get surface() {
    return round(this.retained * this.constant / 100, 4)
  }
}

// Total results class
class Total {
  constructor(a, b) {
    this._groups = a
    this._index = b
  }

  get groups() {
    return this._groups
  }

  get index() {
    return this._index
  }

  get surface() {
    let value
    let sum

    value = 0
    sum = 0

    this._groups.forEach(function (element) {
      value = element.surface
      sum = round(sum + value, 4)
    })

    return sum
  }

  get minimum() {
    return round(this.surface * this._index * 100, 4)
  }

  get optimum() {
    return round(this.minimum + 1.75, 4)
  }
}

// Specific surface constants
// for each sieve sizes group
const constants = [
  0.270, // 25,000 mm to 19,000 mm
  0.410, // 19,000 mm to  4,750 mm
  2.050, //  4,750 mm to  0,425 mm
  15.380, //  0,425 mm to  0,075 mm
  53.300 //  0,075 mm to infinite
]

// Sieve opening in milimeters
const openings = [
  25.000,
  19.000,
  4.750,
  0.425,
  0.075,
  Infinity
]

// Global variable
let ss

// Round function to avoid
// the javascript decimal numbers
// related errors
const round = (value, decimals) => {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// Get data from 'source-data' form
// and put in a sieves array
// don´t save asphalt index value
// instead add a virtual infinity sieve
const buildSieves = () => {
  let form
  let sieves
  let opening
  let passing
  let len
  let i

  form = document.getElementById("source-data")
  sieves = []
  opening = 0
  passing = 0
  len = form.length

  for (i = 0; i < len; i++) {
    if (i == len - 1) {
      opening = openings[i]
      passing = 0
      sieves[i] = new Sieve(opening, passing)
    } else {
      opening = openings[i]
      passing = round(form[i].value, 4)
      sieves[i] = new Sieve(opening, passing)
    }
  }

  return sieves
}

// Build an array with pair of sieves
const buildSieveGroups = () => {
  let sieves
  let groups
  let sieveA
  let sieveB
  let constant
  let len
  let i

  sieves = buildSieves()
  groups = []
  sieveA = {}
  sieveB = {}
  constant = 0

  len = sieves.length - 1
  for (i = 0; i < len; i++) {
    sieveA = sieves[i]
    sieveB = sieves[i + 1]
    constant = constants[i]
    groups[i] = new Group(sieveA, sieveB, constant)
  }

  return groups
}

const buildTotal = () => {
  let groups
  let form
  let total
  let index
  let i

  groups = buildSieveGroups()
  form = document.getElementById("source-data")
  i = form.length - 1
  index = round(form[i].value, 4)
  total = new Total(groups, index)

  return total
}

const calculate = () => {
  ss = buildTotal()
}

const show = () => {
  let table
  let rows
  let retained
  let surface
  let minimum
  let optimum
  let len
  let i

  table = document.getElementById("partials")
  rows = table.children[1].children
  len = rows.length
  retained = 0
  surface = 0

  for (i = 0; i < len; i++) {
    retained = ss.groups[i].retained
    surface = ss.groups[i].surface
    rows[i].children[2].children[0].value = retained.toFixed(1)
    rows[i].children[4].children[0].value = surface.toFixed(2)
  }

  table = document.getElementById("totals")
  rows = table.children[1].children
  surface = 0
  minimum = 0
  optimum = 0

  for (i = 0; i < len; i++) {
    surface = ss.surface
    minimum = ss.minimum
    optimum = ss.optimum
    rows[i].children[0].children[0].value = surface.toFixed(2)
    rows[i].children[1].children[0].value = minimum.toFixed(2)
    rows[i].children[2].children[0].value = optimum.toFixed(2)
  }
}

// Add action to button
let btnCalculate = document.getElementById("btn-calculate")
btnCalculate.addEventListener("click", calculate, false)
btnCalculate.addEventListener("click", show, false)
