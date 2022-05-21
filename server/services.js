const db = require('./databasepg')


const getAllPrograms = async (req, res, pgClient) => {
  try{
    const allPrograms = await db.getAllPrograms(pgClient)

    res.send({ allPrograms });
  }catch(e){
    res.send({ success: false });
  }
}

const changeIsToWatchChange = async (req, res, pgClient) => {
  try{
    const url = req.body.url;
    const isToWatch = req.body.isToWatch
    
    db.changeIsToWatchChange(pgClient, url, isToWatch)
  
    res.send({ success: true });
  }catch (e){
    res.send({ success: false });
  }
}

const addProgram = async (req, res, pgClient) => {
  try{
    const program = req.body.program;
  
    db.setProgramToBeHisotry(pgClient, program)

    
    db.addProgram(pgClient, program)

    res.send({ success: true });
  }catch (e){
    res.send({ success: false });
  }
}

const getProgramHistory = async (req, res, pgClient) => {
  try{
    const url = req.body.url;
    
    const history = await db.getProgramHistory(pgClient, url);

    res.send({ history });
  }catch(e){
    res.send({ success: false });
  }
}

module.exports = {
  getAllPrograms,
  changeIsToWatchChange, 
  addProgram,
  getProgramHistory,
};