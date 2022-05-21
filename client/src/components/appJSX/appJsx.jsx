import React, { useState, useEffect, useCallback } from 'react';

import './appJsx.css';
import ProgramsTable from '../../components/programsTable/programsTable';
import Button from '@mui/material/Button';
import { application_name } from 'pg/lib/defaults';

const AppJsx = () => {
  const [programs, setPrograms] = useState([])
  const [history, setHistory] = useState([])
  const [isShowHistory, setIsShowHistory] = useState(false)

  //could use redux and update state , but its too much boiler plate
  const getPrograms = useCallback(() => {
    fetch('/api/getPrograms')
    .then(response => response.json())
    .then(programsData => {    
      const sortedPrograms = programsData.allPrograms.sort((a,b) => a.id - b.id)  
      setPrograms(sortedPrograms)
    })
  }, [])

  //could use redux and update state , but its too much boiler plate
  const changeIsToWatchChange = useCallback(async (url, isToWatch, onSuccess, onFail) => {
    let res = await fetch('/api/changeIsToWatchChange', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ url, isToWatch })
    })
    .then(response => response.json())

    if(res.success){
      getPrograms() //due to a bug and a lack of time, getting programs instead of updating state.  
    }  else{
      alert('error')
    }
  }, [])

  //could use redux and update state , but its too much boiler plate
  const fetchHistory = useCallback((url) => {
    fetch('/api/fetchHistory', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify({ url })
    })
    .then(response => response.json())
    .then(programsData => {      
      let sorted = programsData.history.sort((a,b) => a.id - b.id)
      setHistory(sorted)
      
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
        { isShowHistory && history && history.length > 0 ? <div> 
          <div style={{marginTop: 40}}> history </div>
          <div className='tableContainer'>
            <ProgramsTable programs={history} changeIsToWatchChange={changeIsToWatchChange} 
              isShowHistoryButton={false} 
              isShowWatchUpdates={false}
              /> 
          </div>
        </div>
        :
        programs && programs.length && 'no history yet'
        }
      </div>

}

export default AppJsx;
