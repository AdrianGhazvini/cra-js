import React, { useEffect, useState, useCallback, useRef } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useLocales } from 'src/locales';
// components
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
// axios
import axios, { getUserImages, endpoints } from 'src/utils/axios';
//
import Editor from 'src/components/editor'; 
import MailHeader from '../mail-header';
import MailCompose from '../mail-compose';

// ----------------------------------------------------------------------

export default function MailView() {
  const { t } = useLocales();

  const { user } = useMockedUser();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const openNav = useBoolean();

  const openCompose = useBoolean();

  const [letterSent, setLetterSent] = useState(false);
  
  const [hasUserTyped, setHasUserTyped] = useState(false);

  const [disputeItemParent, setDisputeItemParent] = useState("");

  const [disputeLetter, setDisputeLetter] = useState("");

  const [driversLicenseUrl, setDriversLicenseUrl] = useState("");
  const [utilityBillUrl, setUtilityBillUrl] = useState("");

  const quillRef = useRef(null);

  const placeholder = t('dispute_letter_placeholder');

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
    setLetterSent(true);
  };

  const handleSave = async () => {
    const editorContent = quillRef.current.getEditor().root.innerHTML;

    try {
      console.log('disputeItemParent: ', disputeItemParent);
      await axios.post(endpoints.letter.save, {
        user_id: user?.id,
        letter: editorContent,
        dispute_reason: disputeItemParent,
        letter_sent: letterSent
      });

      enqueueSnackbar('Letter Saved Successfully!');
    } catch (error) {
      console.error('Failed to save letter:', error);
    }
  };

  const fetchUserImages = useCallback(async () => {
    try {
      const userId = user?.id;
      const images = await getUserImages(userId);
      if (images.drivers_license && images.utility_bill) {
        setDriversLicenseUrl(`http://localhost:8000${images.drivers_license}`);
        setUtilityBillUrl(`http://localhost:8000${images.utility_bill}`);
      } else {
        console.error('User images not found');
      }
    } catch (error) {
      console.error('Failed to fetch user images:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserImages();
  }, [fetchUserImages]);

  useEffect(() => {
    if (openCompose.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [openCompose.value]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {t('mail')}
        </Typography>

        <Stack
          spacing={1}
          sx={{
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
          >
            <MailHeader
              onOpenNav={openNav.onTrue}
              setDisputeLetter={setDisputeLetter}
              setDisputeItemParent={setDisputeItemParent}
              driversLicenseUrl={driversLicenseUrl}
              utilityBillUrl={utilityBillUrl}
            />
          </Stack>
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
              value={disputeLetter}
              name={user?.displayName}
              disputeItemParent={disputeItemParent}
              driversLicenseUrl={driversLicenseUrl}
              utilityBillUrl={utilityBillUrl}
              onContentChange={() => setHasUserTyped(true)}
              placeholder={placeholder}
            />
          </Stack>
          <Grid
            container
            spacing={3}
            justify="space-between"
          >
            <Grid item xs={4}> 
              <Button
                variant="contained"
                color="primary"
                style={{ minHeight: '50px', marginBottom: '8px', width: '100%' }}
                disabled={!hasUserTyped}
                onClick={handleSave}
              >
                {t('save_letter')}
              </Button>
            </Grid>
            <Grid item xs={4}> 
              <Button
                variant="contained"
                color="primary"
                style={{ minHeight: '50px', marginBottom: '8px', width: '100%' }}
                disabled={!hasUserTyped}
                onClick={handlePrint}
              >
                {t('print_letter')}
              </Button>
            </Grid>
            <Grid item xs={4}> 
              <Button
                variant="contained"
                color="primary"
                style={{ minHeight: '50px', marginBottom: '8px', width: '100%' }}
                disabled={!hasUserTyped}
                onClick={handleSent}
              >
                {t('send_letter')}
              </Button>
            </Grid>
          </Grid>

        </Stack>
      </Container>

      {openCompose.value && <MailCompose onCloseCompose={openCompose.onFalse} />}
    </>
  );
}
