import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FileThumbnail from 'src/components/file-thumbnail';
// utils
import LetterManagerFileDetails from './letter-manager-file-details';

// ----------------------------------------------------------------------

export default function LetterManagerTableRow({ row_id, row, selected, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { name: recipient, item_disputed, created, status, path } = row;

  console.log("row_id: ", row_id);
  const id = row_id;

  const newPath = `http://localhost:8000${path}`

  const { enqueueSnackbar } = useSnackbar();
  
  const [textContent, setTextContent] = useState(''); 

  const [updatedStatus, setUpdatedStatus] = useState(status);

  const details = useBoolean();

  const share = useBoolean();

  const [confirm, setConfirm] = useState(false);

  const popover = usePopover();

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  useEffect(() => {
    const fetchData = async () => {
      const cacheBuster = new Date().getTime();
      const response = await fetch(`${newPath}?t=${cacheBuster}`);
      const newTextContent = await response.text();
      setTextContent(newTextContent);
    };
    if(details.value) {
      fetchData();
    }
  }, [newPath, details.value]); 

  const handlePrint = async () => {
    const iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
    iframe.contentDocument.write(`
    <html>
      <head>
        <title>Print Letter</title>
        <style>
          img {
            max-width: 300px;
            height: auto;
          }
        </style>
      </head>
      <body>
        <div>${textContent}</div>
      </body>
    </html>
  `);
    iframe.contentDocument.close();
    iframe.onload = () => {
      iframe.contentWindow.print();
    }
    enqueueSnackbar('Printed!');
    // document.body.removeChild(iframe);
  }

  const defaultStyles = {
    borderTop: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
  };

  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: theme.customShadows.z20,
            },
          },
          [`& .${tableCellClasses.root}`]: {
            ...defaultStyles,
          },
          ...(details.value && {
            [`& .${tableCellClasses.root}`]: {
              ...defaultStyles,
            },
          }),
        }}
      >
          <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>

            <Typography
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {recipient}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap', display: { xs: 'none', md: 'table-cell' } }}> 
          {item_disputed}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap', display: { xs: 'none', md: 'table-cell' } }}> 
          <ListItemText
            primary={format(new Date(created), 'dd/MM/yyyy')}
            secondary={format(new Date(created), 'p')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell align="right" onClick={handleClick} sx={{ whiteSpace: 'nowrap', display: { xs: 'none', md: 'table-cell' } }}>
          {updatedStatus === true ? "Sent" : "Not Sent"}
        </TableCell>

        <TableCell
          align="right"
          sx={{
            px: 1,
            whiteSpace: 'nowrap',
          }}
        >
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            handlePrint();
          }}
        >
          <Iconify icon="fluent:print-20-filled" />
          Print
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            setConfirm(true);
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <LetterManagerFileDetails
        item={row}
        onPrintLink={handlePrint}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
        value={textContent}
        item_disputed={item_disputed}
        letter_name={recipient}
        item_id={id}
        setUpdatedStatus={setUpdatedStatus}
        setConfirm={setConfirm}
      />
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => {
            onDeleteRow();
            setConfirm(false);
          }}>
            Delete
          </Button>
        }
      />
    </>
  );
}

LetterManagerTableRow.propTypes = {
  row_id: PropTypes.number,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
