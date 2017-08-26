const { got } = require('./mocks')
const { date_ago } = require('../lib/util')
const { issues } = require('./mocks/issues.json')
const { request, lead, cycle, metrics, date_to_status } = require('../lib')

describe('lib', () => {
  describe('#request', () => {
    const opts = {jira: '', user: '', pass: '', endpoint: ''}

    test('should return a function', () => {
      expect(typeof request(opts)).toBe('function')
    })

    test('function returned should return a promise', async () => {
      const api = request(opts, got)
      const res = await api()
      expect(api() instanceof Promise).toBe(true)
      expect(res.length).toBe(4)
      expect(res).toHaveLength(4)
    })
  })

  describe('#lead', () => {
    const opts = {jira: '', user: '', pass: '', endpoint: ''}

    test('should return return the lead time for given issue', () => {
      expect(lead(issues[0], 'ToDo')).toBe(1)
    })
  })

  describe('#cycle', () => {
    test('should return return the lead time for given issue', () => {
      expect(cycle(issues[3], 'In Progress', 'ToDo')).toBe(8)
    })

    test('should use issue creation date when status transition date not available', () => {
      expect(cycle(issues[3], 'NonExistent', 'ToDo')).toBe(1)
    })
  })

  describe('#date_to_status', () => {
    test('should return the date transition to a given status', () => {
      expect(date_to_status('NonExistentSTatus', issues[0].changelog)).toBeUndefined()
      expect(date_to_status('ToDo', issues[0].changelog)).toBe('2017-08-07T11:56:53.090+0000')
      expect(date_to_status('In Progress', issues[0].changelog)).toBe('2017-08-07T11:56:57.293+0000')
    })
  })

  describe('#metrics', () => {
    let options = {
      auto: false,
      done: 'Done',
      todo: 'ToDo',
      start: '2017-08-01',
      finish: '2017-08-26',
    }

    const makeOptions = (opts) => Object.assign({}, options, opts)

    describe('automatic period', () => {
      it('should not be used when false', () => {
        expect(metrics(options, issues)).toMatchObject({
          throughput: 0.16
        })
      })

      it('should return correct througput when set', () => {
        expect(metrics(makeOptions({ auto: 4 }), issues)).toMatchObject({
          throughput: 1
        })
        expect(metrics(makeOptions({ auto: 2 }), issues)).toMatchObject({
          throughput: 2
        })
      })
    })
  })
})
