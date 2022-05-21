
const getIsToWatchUrls = async function (pgClient){
  const query1 = 'select * from isToWatch'

  let urlsWithIsToWatch = await pgClient.query(query1)

  if(!urlsWithIsToWatch){
    return []
  }

  return urlsWithIsToWatch.rows
}

const getUrlsForCrawling = async function (pgClient){
  const query1 = 'select * from urlForCrawling'

  let urls = await pgClient.query(query1)

  if(!urls){
    return []
  }

  return urls.rows
}

const getAllPrograms = async function (pgClient){
  console.log('in getAllPrograms')

  const programs = await pgClient.query('select * from programs where isHistory = false')

  return programs.rows
}

const changeIsToWatchChange = async function (pgClient, url, isToWatch){
  console.log('in changeIsToWatchChange')
  const query = `update isToWatch SET isToWatch = '${isToWatch}' where programUrl = '${url}'`
  // const query = `update isToWatch SET isToWatch = '${isToWatch}' where programUrl = '${url}'`
  // const query = `select * from istowatch`
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

  // let fixedProgramUrl = program.url.replace(':', '')
  // let fixedProgramUrl = program.url.replace('https://', '')

  const getProgramQuery = `select * from programs where url = '${program.url}' and isOpenStatus='${program.isOpenStatus}' and isHistory='0'`
  
  let  existingPrograms = await pgClient.query(getProgramQuery)

  existingPrograms = existingPrograms.rows

  const isProgramExists = existingPrograms?.length > 0

  //add another row only if data is different 
  if(isProgramExists && existingPrograms[0].isOpenStatus != program.isOpenStatus){

    const programToSetHistory = existingPrograms[0]

    await setProgramToBeHisotry(pgClient, programToSetHistory)
  }

  //worked
  const programIsOpenStatus = program.isOpenStatus.toString().toLowerCase() == 'true' ? '1' : '0' 
  
  const insertQuery = `insert into programs (foundationName, programName, eligibleTreatments, isOpenStatus, grantAmount, url, isHistory) values ` + 
  `('${program.foundationName}', '${program.programName}', ARRAY [${program.eligibleTreatments}], '${programIsOpenStatus}', ${program.grantAmount}, '${program.url}', '0')`  //works

  //for testing 
  // const insertQuery = `insert into programs (foundationName) values ('111')`  //works

  await pgClient.query(insertQuery) //await for testing  , need to change to promise

  console.log('added program----------------------------------')

  //if its a new parsed url , add it to isToWatch table
  if(!isProgramExists){
    const addIsToWatchQuery = `insert into isToWatch (programUrl, isToWatch)
    values ('${program.url}', '1')`
  
    await pgClient.query(addIsToWatchQuery)
  } 
}

const getProgramHistory = async function (pgClient, url){
  console.log('in getProgramHistory')

  const query = `select * from programs where isHistory = true and url = '${url}'`

  const res = await pgClient.query(query)

  return res.rows
}

module.exports = {
  getAllPrograms, 
  addProgram, 
  changeIsToWatchChange,
  getProgramHistory,
  getUrlsForCrawling,
  getIsToWatchUrls,
};