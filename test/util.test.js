const { pad, csv, date_ago, days_between, num_reducer, replace, generate_dates } = require('../lib/util')


describe('util', () => {
  describe('#pad', () => {
    test('should pad with zero when number is 1 digit', () => {
      expect(pad(0)).toBe('00')
      expect(pad(1)).toBe('01')
    })

    test('should not pad with zero when number is 2 digits', () => {
      expect(pad(10)).toBe('10')
      expect(pad(20)).toBe('20')
    })
  })

  describe('#csv', () => {
    test('should output comma separated list of object values', () => {
      expect(csv({})).toBe('')
      expect(csv({a:'x', b: 'y', c: 'z'})).toBe('x, y, z')
    })
  })

  describe('#date_ago', () => {
    const d = new Date()
    const date = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${d.getDate()}`
    const year = `${d.getFullYear()-1}-${pad(d.getMonth()+1)}-${d.getDate()}`

    test('should return the date string of n days ago', () => {
      expect(date_ago(0)).toBe(date)
      expect(date_ago(365)).toBe(year)
    })

    test('format should be YYYY-MM-DD', () => {
      expect(date_ago(10)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('#days_between', () => {
    const today = new Date(date_ago(0))
    const yesterday = new Date(date_ago(1))
    const week = new Date(date_ago(7))

    test('should return the date string of n days ago', () => {
      expect(days_between(today, week)).toBe(7)
      expect(days_between(today, today)).toBe(0)
      expect(days_between(today, yesterday)).toBe(1)
    })
  })

  describe('#num_reducer', () => {
    test('should return the date string of n days ago', () => {
      expect([0].reduce(num_reducer), 0).toBe(0)
      expect([1,2,3].reduce(num_reducer), 0).toBe(6)
    })
  })

  describe('#replace', () => {
    let result;
    const string = 'the %name cat is %where %noreplaceme'
    const options = {
      name: 'Felix',
      where: 'in the kitchen'
    }

    beforeEach(() => {
      result = replace(string, options)
    })

    test('should replace %strings for object values', () => {
      expect(result).toContain('Felix')
      expect(result).toContain('in the kitchen')
    })

    test('should replace only matching strings', () => {
      expect(result).toContain('%noreplaceme')
    })
  })

  describe('#generate_dates', () => {
    test('should create an array of dates for default interval and period', () => {
      expect(generate_dates()).toHaveLength(25)
    })

    test('should create an array of dates for given interval and period', () => {
      expect(generate_dates(30, 30)).toHaveLength(1)
      expect(generate_dates(15, 20)).toHaveLength(2)
      expect(generate_dates(15, 31)).toHaveLength(3)
      expect(generate_dates(15, 365)).toHaveLength(25)
    })
  })
})
