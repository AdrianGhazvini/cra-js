import React, { useRef } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
// axios
import axios, { endpoints } from 'src/utils/axios';
//
import Editor from 'src/components/editor';

// ----------------------------------------------------------------------

export default function BlankView() {
  const { user } = useMockedUser();

  const settings = useSettingsContext();

  const quillRef = useRef(null);

  const { enqueueSnackbar } = useSnackbar();

  const handleSent = async () => {
    const editorContent = quillRef.current.getEditor().root.innerHTML;
    try {
      await axios.post(endpoints.support.send, {
        name: user?.firstName,
        email: user?.email,
        message: editorContent,
      });

      enqueueSnackbar('Message sent successfully!');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Support
      </Typography>

      <Stack
        spacing={1}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 1,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#F4F6F8',
        }}
      >
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
            overflowY: 'auto',
          }}
        >
          <Editor
            quillRef={quillRef}
            placeholder="Type your message here..."
          />
        </Stack>
        <Button variant="contained"
            color="primary"
            onClick={handleSent}
            style={{ minHeight: '50px', marginBottom: '8px' }}
          >
            Send
          </Button>
      </Stack>
    </Container>
  );
}
