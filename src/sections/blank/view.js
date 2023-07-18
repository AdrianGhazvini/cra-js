import React, { useRef, useState, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// locales
import { useLocales } from 'src/locales';
// components
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
// axios
import axios, { endpoints } from 'src/utils/axios';
//
import Editor from 'src/components/editor';

// ----------------------------------------------------------------------

export default function BlankView() {
  const { t } = useLocales();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(endpoints.auth.me);

        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getUserData();
  }, []);

  const settings = useSettingsContext();

  const quillRef = useRef(null);

  const { enqueueSnackbar } = useSnackbar();

  const handleSent = async () => {
    const editorContent = quillRef.current.getEditor().root.innerHTML;
    try {
      const displayName = `${user? user.first_name: ""} ${user? user.last_name: ""}`;
      await axios.post(endpoints.support.send, {
        name: displayName,
        email: user? user.email: "",
        message: editorContent,
      });

      enqueueSnackbar(t('message_sent_successfully'));
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
        {t('blank')}
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
            placeholder={t('type_message_here')}
          />
        </Stack>
        <Button variant="contained"
            color="primary"
            onClick={handleSent}
            style={{ minHeight: '50px', marginBottom: '8px' }}
          >
            {t('send')}
          </Button>
      </Stack>
    </Container>
  );
}
