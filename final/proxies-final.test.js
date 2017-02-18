
/* global test expect */

test('Returns a default value if the property does not exist', () => {
  const handler = {
    get: (target, name) => {
      return name in target ? target[name] : 37
    }
  }
  const target = {}
  const p = new Proxy(target, handler)
  p.a = 1
  p.b = undefined
  expect(p.a).toBe(1)
  expect(p.b).toBe(undefined)
  expect('c' in p).toBe(false)
  expect(p.c).toBe(37)
})

test('Throws an exception if age is invalid', () => {
  const handler = {
    set: (target, prop, value) => {
      if (prop === 'age') {
        if (!Number.isInteger(value)) {
          throw new TypeError('invalid age')
        }
        target[prop] = value
        return true // this is important
      }
    }
  }
  const target = {}
  const proxy = new Proxy(target, handler)
  expect(() => { proxy.age = 'invalid' }).toThrow()
  proxy.age = 29
  expect(proxy.age).toBe(29)
})

test('Easy Access for some properties', () => {
  const handler = {
    get: (target, prop) => {
      if (prop in target.personalInfos) {
        return target.personalInfos[prop]
      }
      return target[prop]
    }
  }
  const target = {
    personalInfos: {
      firstname: 'Jhon',
      lastname: 'Doe',
      age: 29
    },
    id: 1234
  }
  const proxy = new Proxy(target, handler)
  expect(proxy.personalInfos.age).toBe(29)
  expect(proxy.id).toBe(1234)
  expect(proxy.age).toBe(29)
})

test('No Access for private member', () => {
  const handler = {
    set: (target, prop, value) => {
      if (prop[0] === '_') {
        throw new TypeError(`invalid set to a private member ${prop}`)
      }
      target[prop] = value
      return true
    },
    has: (target, prop) => {
      if (prop[0] === '_') {
        return false
      }
      return prop in target
    }
  }
  const target = {
    personalInfos: {
      firstname: 'Jhon',
      lastname: 'Doe',
      age: 29
    },
    _id: 1234
  }
  const proxy = new Proxy(target, handler)
  proxy.a = 'b'
  expect(proxy.a).toBe('b')
  expect('_id' in proxy).toBe(false)
  expect('personalInfos' in proxy).toBe(true)
  expect(() => { proxy._id = 9876 }).toThrow()
})

test('Bonus, python like array', () => {
  const handler = {
    get: (target, prop) => {
      if (prop in target) {
        return target[prop]
      }
      const i = parseInt(prop)
      if (!isNaN(i) && i < 0 && Math.abs(i) <= target.length) {
        return target[target.length + i]
      }
    }
  }
  let proxiedArray = new Proxy([], handler)

  proxiedArray.push('first', 'second', 'third')

  expect(proxiedArray[0]).toBe('first')
  expect(proxiedArray[-1]).toBe('third')
})

