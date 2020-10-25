var hostile = require('../')
var test = require('tape')
var mockFs = require('mock-fs')

mockFs({
  // Linux
  '/etc/hosts': '',
  // Windows
  'C:/Windows/System32/drivers/etc/hosts': ''
})

test('set', function (t) {
  t.plan(3)
  hostile.set('127.0.0.1', 'peercdn.com', function (err) {
    t.error(err)
    hostile.get(false, function (err, lines) {
      t.error(err)
      lines.forEach(function (line) {
        if (line[0] === '127.0.0.1' && line[1] === 'peercdn.com') {
          t.pass('set worked')
        }
      })
    })
  })
})

test('set ipv6', function (t) {
  t.plan(4)
  hostile.set('::1', 'peercdn.com', function (err) {
    t.error(err)
    hostile.get(false, function (err, lines) {
      t.error(err)
      var exists = lines.some(function (line) {
        return line[0] === '::1' && line[1] === 'peercdn.com'
      })
      t.ok(exists, 'ipv6 line was added')
      exists = lines.some(function (line) {
        return line[0] === '127.0.0.1' && line[1] === 'peercdn.com'
      })
      t.ok(exists, 'ipv4 line still exists & was not replaced')
    })
  })
})

test('remove ipv4', function (t) {
  t.plan(2)
  hostile.remove('127.0.0.1', 'peercdn.com', function (err) {
    t.error(err)
    hostile.get(false, function (err, lines) {
      t.error(err)
      lines.forEach(function (line) {
        if (line[0] === '127.0.0.1' && line[1] === 'peercdn.com') {
          t.fail('remove failed')
        }
      })
    })
  })
})

test('remove ipv6', function (t) {
  t.plan(2)
  hostile.remove('::1', 'peercdn.com', function (err) {
    t.error(err)
    hostile.get(false, function (err, lines) {
      t.error(err)
      lines.forEach(function (line) {
        if (line[0] === '::1' && line[1] === 'peercdn.com') {
          t.fail('remove failed')
        }
      })
    })
  })
})

test('set and get space-separated domains', function (t) {
  t.plan(3)
  hostile.set('127.0.0.5', 'www.peercdn.com  m.peercdn.com', function (err) {
    t.error(err)
    hostile.get(false, function (err, lines) {
      t.error(err)
      var exists = lines.some(function (line) {
        return line[0] === '127.0.0.5' && line[1] === 'www.peercdn.com  m.peercdn.com'
      })
      t.ok(exists, 'host line exists')
    })
  })
})
