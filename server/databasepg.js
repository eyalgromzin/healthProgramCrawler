

const getAllPrograms = async function (pgClient){
  console.log('in getAllPrograms')

  const programs = await pgClient.query('select * from programs where isHistory = false')

  return programs.rows
}

const changeIsToWatchChange = async function (pgClient, url, isToWatch){
  console.log('in changeIsToWatchChange')
  // const query = `update isToWatch SET isToWatch = '${isToWatch}' where programUrl = '${url}'`
  // const query = `update isToWatch SET isToWatch = '${isToWatch}' where programUrl = '${url}'`
  const query = `select * from istotatch`
  const res = await pgClient.query(query)
  let s = 4
}

const setProgramToBeHisotry = async function (pgClient, program){
  console.log('in setProgramToBeHisotry')

  const query = `update programs set isHistory = true where id=${program.id} `

  return pgClient.query(query)
}

const addProgram = async function (pgClient, program){
  console.log('in addProgram')

  const getProgramQuery = `select * from programs where programUrl = ${program.url}`
  
  const existingPrograms = await pgClient.query(getProgramQuery).rows

  const isProgramExists = existingPrograms?.length > 0

  const promises = []

  let promise

  if(isProgramExists){
    promise = setProgramToBeHisotry(program)

    promises.push(promise)
  }

  const insertQuery = `insert into programs (url, foundationName, programName, eligibleTreatments, isOpenStatus, grantAmount, url, isHistory)
  values (${program.foundationName}, ${program.programName}, ARRAY [${program.eligibleTreatments}], 
    ${program.isOpenStatus}, ${program.grantAmount}, ${program.url}, false)`

  promise = pgClient.query(insertQuery)

  promises.push(promise)

  if(!isProgramExists){
    const addIsToWatchQuery = `insert into isToWatchTable (programUrl, isToWatch)
    values (${program.url}, true)`
  
    promise = pgClient.query(addIsToWatchQuery)

    promises.push(promise)
  }

  await Promise.all(promises)  
}

const getProgramHistory = async function (pgClient, url){
  console.log('in getProgramHistory')

  const query = `select * from programs where isHistory = true and url = ${url}`

  const res = await pgClient.query(query)

  return res.rows
}

module.exports = {
  getAllPrograms, 
  addProgram, 
  changeIsToWatchChange,
  getProgramHistory,
};