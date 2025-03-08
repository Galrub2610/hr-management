import styled from 'styled-components';
import React from 'react';

const CitiesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 8px;
    text-align: right;
    white-space: nowrap;
    width: min-content;
  }

  th {
    .column-title {
      font-weight: bold;
    }
    
    .column-subtitle,
    .column-variable {
      display: none;
    }
  }
`; 