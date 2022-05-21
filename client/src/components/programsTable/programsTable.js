import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

const ProgramsTable = ({programs, changeIsToWatchChange, onRowClick}) => {
  return (
    // <div style={{display: 'inline-block'}}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>foundation name</TableCell>
              <TableCell>program name</TableCell>
              <TableCell>eligible treatments</TableCell>
              <TableCell>status</TableCell>
              <TableCell>amount</TableCell>
              <TableCell>is watch updates</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((program) => (
              <TableRow
                key={program.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => onRowClick(program)}
                hover={true}
              >
                <TableCell component="th" scope="row">{program.foundationname}</TableCell>
                <TableCell>{program.programname}</TableCell>
                <TableCell>{program.eligibletreatments.join(', ')}</TableCell>
                <TableCell>{program.isopenstatus ? 'True' : 'false'}</TableCell>
                <TableCell>{program.grantamount}</TableCell>
                <TableCell>
                  <Checkbox
                  checked={program.istowatch}
                  onChange={() => changeIsToWatchChange(program.url, !program.istowatch)}
                  inputProps={{ 'aria-label': 'controlled' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    // </div>
  );
}

export default ProgramsTable