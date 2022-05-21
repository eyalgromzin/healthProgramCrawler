import React, { useState, useEffect, useCallback } from 'react';

import './App.css';
import ProgramsTable from './components/programsTable/programsTable';
import Button from '@mui/material/Button';
import { application_name } from 'pg/lib/defaults';
import AppJsx from './components/appJSX/appJsx';

const App = () => {
  // const [programs, setPrograms] = useState([])
  // const [history, setHistory] = useState([])
  // const [isShowHistory, setIsShowHistory] = useState(false)

  // const getPrograms = useCallback(() => {
  //   fetch('/api/getPrograms')
  //   .then(response => response.json())
  //   .then(programsData => {      
  //     setPrograms(programsData.allPrograms)
  //   })
  // }, [])
  
  // const changeTableRowToggle = (url, isWatchChange) => {

  //   const newTableData = JSON.parse(JSON.stringify(programs))
    
  //   newTableData.forEach(row => {
  //     if(row.url === url){
  //       row.isWatchChange = isWatchChange
  //     }
  //   });

  //   setPrograms(newTableData)
  // }

  // const changeIsToWatchChange = useCallback((url, isToWatch) => {
  //   fetch('/api/changeIsToWatchChange', {
  //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
  //     // mode: 'cors',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify({ url, isToWatch })
  //   })
  //   .then(response => response.json())
  //   .then(data => {  
  //     if(data.success){
  //       changeTableRowToggle(url, isToWatch)
  //     }  else{
  //       alert('error')
  //     }
  //   })
  // }, [])

  // const fetchHistory = useCallback((url) => {
  //   fetch('/api/fetchHistory', {
  //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
  //     headers: {'Content-Type': 'application/json'},
  //     mode: 'cors'
  //   })
  //   .then(response => response.json())
  //   .then(programsData => {      
  //     setPrograms(programsData.programs)
  //     setIsShowHistory(true)
  //   })
  // }, [])

  // const onRowClick = (row) => {
  //   fetchHistory()
  // }
  
  // return <div className="App">
  //       <Button onClick={getPrograms}>get programs!</Button>
  //       <div className='tableContainer'>
  //         { programs && programs.length > 0 && <ProgramsTable programs={programs} 
  //             changeIsToWatchChange={changeIsToWatchChange} onRowClick={onRowClick} /> }

  //       </div>
  //       { isShowHistory && <div> 
  //         <div style={{marginTop: 40}}> history </div>
  //         <div className='tableContainer'>
  //           <ProgramsTable programs={history} changeIsToWatchChange={changeIsToWatchChange} /> 
  //         </div>
  //       </div>}
  //     </div>

  return <AppJsx />

}

export default App;
