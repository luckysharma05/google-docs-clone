import React from 'react';
import {AddToDrive as Add, MailOutline as Subtract, CalendarToday as Multiply, Groups as Divide} from '@mui/icons-material';

const Table = () => {
  return (
    <table className='table'>
      <tbody>
        <thead>
            <td>More From Google</td>
        </thead>
        <tr>
            <td><a href='https://drive.google.com/'><Add class="element" style={{background: 'blue'} }/></a></td>
        </tr>
        <tr>
            <td><a href='https://mail.google.com/'><Subtract class="element" style={{background: 'red'}}/></a></td>
        </tr>
        <tr>
            <td><a href='https://calendar.google.com/'><Multiply class="element" style={{background: 'yellow'}}/></a></td>
        </tr>
        <tr>
            <td><a href='https://meet.google.com/'><Divide class="element" style={{background: 'green'}}/></a></td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
