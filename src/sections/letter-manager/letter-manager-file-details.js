import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import Iconify from 'src/components/iconify';
import axios , { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
//
import Editor from 'src/components/editor'; 
import { set } from 'lodash';


// ----------------------------------------------------------------------

export default function LetterManagerFileDetails({
  item,
  open,
  //
  onCopyLink,
  onClose,
  onDelete,
  value,
  itemDisputed,
  letter_name,
  item_id,
  setUpdatedStatus,
  setConfirm,
  ...other
}) {
  const { user } = useMockedUser();

  const { enqueueSnackbar } = useSnackbar();

  const quillRef = useRef(null);

  const handlePrint = () => {
    const editorContent = quillRef.current.getEditor().root.innerHTML;

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
        <div>${editorContent}</div>
      </body>
    </html>
  `);
    iframe.contentDocument.close();
    iframe.onload = () => {
      iframe.contentWindow.print();
    }
    // document.body.removeChild(iframe);
  }

  const handleSent = async () => {
    try {
      await axios.put(endpoints.letter.update_letter_sent_status, {
        id: item_id,
        status: true,
      });
      setUpdatedStatus(true);
      enqueueSnackbar('Status Updated Successfully!');
    } catch (error) {
      console.error('Failed to Update Status:', error);
    }
  };

  const handleSave = async () => {
    const editorContent = quillRef.current.getEditor().root.innerHTML;

    try {
      await axios.put(endpoints.letter.update_letter, {
        name: letter_name,
        letter: editorContent,
      });
      enqueueSnackbar('Letter Saved Successfully!');
    } catch (error) {
      console.error('Failed to save letter:', error);
    }
  };

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> Edit Letter </DialogTitle>
        <Stack
          spacing={1}
          direction="row"
          flexGrow={1}
          sx={{
            height: {
              xs: '72vh',
            },
            backgroundColor: 'white',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Editor
            quillRef={quillRef}
            value={value}
          />
          <Grid
            container
            spacing={3}
            justify="space-between"
            paddingX={3}
          >
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                style={{ minHeight: '50px', marginBottom: '8px', width: '100%' }}
                onClick={handleSave}
              >
                Save Letter
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                style={{ minHeight: '50px', marginBottom: '8px', width: '100%' }}
                onClick={handlePrint}
              >
                Print Letter
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                style={{ minHeight: '50px', marginBottom: '8px', width: '100%' }}
                onClick={handleSent}
              >
                Send it For You
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ px: 3 , pb: 3}}>
            <Button
              fullWidth
              variant="soft"
              color="error"
              size="large"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => {setConfirm(true); onClose()} }
            >
              Delete
            </Button>
          </Box>
        </Stack>
      </Dialog>
    </>
  );
}

LetterManagerFileDetails.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func,
  onCopyLink: PropTypes.func,
  onDelete: PropTypes.func,
  open: PropTypes.bool,
  value: PropTypes.string,
  itemDisputed: PropTypes.string,
  letter_name: PropTypes.string,
  item_id: PropTypes.number,
  setUpdatedStatus: PropTypes.func,
  setConfirm: PropTypes.func,
};
