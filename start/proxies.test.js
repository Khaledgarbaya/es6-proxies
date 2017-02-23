/* eslint-disable */

test.skip('private property using get, set, has and deleteProperty traps', () => {
  const target = {
    _id: 'klsjdahflkastfaskfdg',
    age: 29,
    name: 'Khaled'
  }

  const handler = {}
  const proxy = new Proxy(target, handler)
})

test.skip('migrate object with backward compatibility using get, set and has traps', () => {
  const target = {
    personalInfos: {
      age: 29,
      name: 'Khaled',
      email: 'bla@gmail.com'
    },
    userGroup: 'Nodejs'
      }
  const handler = {}
  const proxy = new Proxy(target, handler)
})

test.skip('inheritance || branching', () => {
  class Author {}
  class Admin {}
  class Developer {}
  class Writer {}

  function target(){}
  const handler = {}
  const User = new Proxy(target, handler)

  expect(new User('admin').constructor.name).toBe('Admin')
  expect(new User('writer').constructor.name).toBe('Writer')
  expect(new User('developer').constructor.name).toBe('Developer')
  expect(new User('author').constructor.name).toBe('Author')
})

test.skip('Bonus: Python like array, if the index is -1 return last item', () => {
  const target = []
  const handler = {}
  const proxy = new Proxy(target, handler)
})

