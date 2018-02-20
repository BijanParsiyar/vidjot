if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 
    'mongodb://test:test@ds243728.mlab.com:43728/vidjot-bijan-prod'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}