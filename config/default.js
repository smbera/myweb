module.exports = {
  port: 3001,
  session: {
    secret: 'myweb',
    key: 'myweb',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/myweb'
};
