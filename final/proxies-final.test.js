/* eslint-disable */

test('private property using get, set, has and deleteProperty traps', () => {
  const target = {
    _id: 'klsjdahflkastfaskfdg',
    age: 29,
    name: 'Khaled'
  }
  const handler = {
    get: (target, prop) => {
      if (prop[0] === '_') {
        throw new TypeError('Access denied')
      }
      return target[prop]
    },
    set: (target, prop, value) => {
      if (prop[0] === '_') {
        throw new TypeError('Access denied')
      }
      target[prop] = value
      return true
    }

  }
  const proxy = new Proxy(target, handler)
  expect(() => {proxy._id}).toThrow()
  expect(() => {proxy._id = 'something'}).toThrow()
  expect(() => {proxy.age}).not.toThrow()
  expect( proxy.age ).toBe(29)
})

test('migrate object with backward compatibility using get, set and has traps', () => {
  const target = {
    personalInfos: {
      age: 29,
      name: 'Khaled',
      email: 'bla@gmail.com'
    },
    userGroup: 'Nodejs'
  }
  const handler = {
    get: (target, prop) => {
      if (prop in target.personalInfos) {
        return target.personalInfos[prop]
      }

      return target[prop]
    },
    set: (target, prop, value) => {
      if (prop in target.personalInfos) {
        target.personalInfos[prop] = value
        return true
      }

      target[prop] = value
      return true

    }
  }
  const proxy = new Proxy(target, handler)
  expect(proxy.age).toBe(proxy.personalInfos.age)
  proxy.age = 30
  expect(proxy.personalInfos.age).toBe(30)
  expect(proxy.userGroup).toBe('Nodejs')
  proxy.userGroup = 'NodeMeetup'
  expect(proxy.userGroup).toBe('NodeMeetup')
})
test('inheritance || branching', () => {
  class Author {}
  class Admin {}
  class Developer {}
  class Writer {}

  function target(){}
  const handler = {
    construct : (target, args) => {
      const [userType] = args
      switch (userType) {
        case 'admin':
          return new Admin(args)
        case 'author':
          return new Author(args)
        case 'developer':
          return new Developer(args)
        case 'writer':
          return new Writer(args)
      }
    }
  }
  const User = new Proxy(target, handler)

  expect(new User('admin').constructor.name).toBe('Admin')
  expect(new User('writer').constructor.name).toBe('Writer')
  expect(new User('developer').constructor.name).toBe('Developer')
  expect(new User('author').constructor.name).toBe('Author')
})

test('Bonus: Python like array, if the index is -1 return last item', () => {
  const target = []
  const handler = {
    get: (target, prop) => {
      if (prop in target) {
        return target[prop]
      }
      const i = parseInt(prop)
      return target[target.length + i]
    }
  }
  const proxy = new Proxy(target, handler)
  proxy.push('first', 'second', 'third')
  expect(proxy[0]).toBe('first')
  expect(proxy[-1]).toBe('third')
  expect(proxy[-2]).toBe('second')
})

