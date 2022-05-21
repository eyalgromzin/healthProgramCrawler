const services = require('./services')

exports.addRoutes = function addRoutes(app, pgClient){
  
  app.get('/api/getPrograms', (req, res) => {
    services.getAllPrograms(req, res, pgClient)
  });
  
  app.post('/api/changeIsToWatchChange', (req, res) => {
    services.changeIsToWatchChange(req, res, pgClient)
  });
  
  app.post('api/addProgram', (req, res) => {
    services.addProgram(req, res, pgClient)
  })
  
  app.post('/api/fetchHistory', (req, res) => {
    services.getProgramHistory(req, res, pgClient)
  });
}