var pgtools = require('pgtools')

const config = {
  user: 'postgres',
  host: process.env.GITHUB === '1' ? 'localhost' : 'db',
  port: 5432,
}
// eslint-disable-next-line
pgtools.createdb(config, 'uplifty', function(err, res) {
  if (err) {
    console.error(err)
    process.exit(-1)
  }
})
