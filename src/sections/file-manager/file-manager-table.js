import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Card from '@mui/material/Card';
import {
  emptyRows,
  TableNoData,
  TableEmptyRows,
} from 'src/components/table';
// locales
import { useLocales } from 'src/locales';
//
import FileManagerTableRow from './file-manager-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
];

// ----------------------------------------------------------------------

export default function FileManagerTable({
  table,
  tableData,
  notFound,
  onDeleteRow,
  dataFiltered,
}) {
  const theme = useTheme();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
  } = table;

  const denseHeight = dense ? 58 : 78;

  const { t } = useLocales();

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
        }}
      >
        <TableContainer
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100rvh',
            overflowY: 'hidden',
          }}
        >
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              borderCollapse: 'separate',
              borderSpacing: '0 16px',
              flexGrow: 1,
            }}
          >
            <Card sx={{ py: 1.5, px: 2, borderRadius: 1.5, backgroundColor: theme.palette.background.neutral, fontSize: "14px" }}>
              {t('file_name')}
            </Card>
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <FileManagerTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => onDeleteRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
              />

              <TableNoData
                notFound={notFound}
                sx={{
                  m: -2,
                  borderRadius: 1.5,
                  border: `dashed 1px ${theme.palette.divider}`,
                }}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

FileManagerTable.propTypes = {
  dataFiltered: PropTypes.array,
  notFound: PropTypes.bool,
  onDeleteRow: PropTypes.func,
  table: PropTypes.object,
  tableData: PropTypes.array,
};
