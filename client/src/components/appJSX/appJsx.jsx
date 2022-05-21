import React, { useState, useEffect, useCallback } from 'react';

import './appJsx.css';
import ProgramsTable from '../../components/programsTable/programsTable';
import Button from '@mui/material/Button';
import { application_name } from 'pg/lib/defaults';

const AppJsx = () => {
  const [programs, setPrograms] = useState([])
  const [history, setHistory] = useState([])
  const [isShowHistory, setIsShowHistory] = useState(false)

  const getPrograms = useCallback(() => {
    fetch('/api/getPrograms')
    .then(response => response.json())
    .then(programsData => {    
      const sortedPrograms = programsData.allPrograms.sort((a,b) => a.id - b.id)  
      setPrograms(sortedPrograms)
    })
  }, [])
  
  // ??? need to check it !!! 
  const changeTableRowToggle = (url, isWatchChange) => {

    const newTableData = JSON.parse(JSON.stringify(programs)) //already []
    
    newTableData.forEach(row => {
      if(row.url === url){
        row.isWatchChange = isWatchChange
      }
    });

    setPrograms(newTableData)
  }

  const changeIsToWatchChange = useCallback(async (url, isToWatch) => {
    let res = await fetch('/api/changeIsToWatchChange', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ url, isToWatch })
    })
    .then(response => response.json())

    if(res.success){
      // changeTableRowToggle(url, isToWatch)  //here its already empty
      getPrograms()
    }  else{
      alert('error')
    }
    
  }, [])

  const fetchHistory = useCallback((url) => {
    fetch('/api/fetchHistory', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify({ url })
    })
    .then(response => response.json())
    .then(programsData => {      
      setHistory(programsData.programs)
      
      setIsShowHistory(true)
    })
  }, [])

  const onRowClick = (program) => {
    fetchHistory(program.url)
  }
  
  const test = () => {
    setHistory([])
  }

  return <div className="App">
        <Button onClick={getPrograms}>get programs!</Button>
        <Button onClick={test}>test</Button>
        <div className='tableContainer'>
          { programs && programs.length > 0 && <ProgramsTable programs={programs} 
              changeIsToWatchChange={changeIsToWatchChange} onRowClick={onRowClick} /> }

        </div>
        { isShowHistory && <div> 
          <div style={{marginTop: 40}}> history </div>
          <div className='tableContainer'>
            <ProgramsTable programs={history} changeIsToWatchChange={changeIsToWatchChange} /> 
          </div>
        </div>}
      </div>

}

export default AppJsx;
