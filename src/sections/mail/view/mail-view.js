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
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
// axios
import { getUserImages } from 'src/utils/axios';
//
import Editor from 'src/components/editor'; 
import MailHeader from '../mail-header';
import MailCompose from '../mail-compose';

// ----------------------------------------------------------------------

const LABEL_INDEX = 'inbox';

export default function MailView() {
  const router = useRouter();

  const { user } = useMockedUser();

  const searchParams = useSearchParams();

  const selectedLabelId = searchParams.get('label') || LABEL_INDEX;

  const selectedMailId = searchParams.get('id') || '';

  const upMd = useResponsive('up', 'md');

  const settings = useSettingsContext();

  const openNav = useBoolean();

  const openMail = useBoolean();

  const openCompose = useBoolean();
  
  const [hasUserTyped, setHasUserTyped] = useState(false);

  const [disputeLetter, setDisputeLetter] = useState("");

  const [hasAddedImages, setHasAddedImages] = useState(false);

  const [driversLicenseUrl, setDriversLicenseUrl] = useState("");
  const [utilityBillUrl, setUtilityBillUrl] = useState("");

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
          Create Dispute Letters
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
              setHasAddedImages={setHasAddedImages}
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
            }}
          >
            <Editor
              quillRef={quillRef}
              value={disputeLetter}
              name={user?.displayName}
              driversLicenseUrl={driversLicenseUrl}
              utilityBillUrl={utilityBillUrl}
              onContentChange={() => setHasUserTyped(true)}
              hasAddedImages={hasAddedImages}
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
              >
                Save Letter
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
                Print Letter
              </Button>
            </Grid>
            <Grid item xs={4}> 
              <Button
                variant="contained"
                color="primary"
                style={{ minHeight: '50px', marginBottom: '8px', width: '100%' }}
                disabled={!hasUserTyped}
              >
                Send it For You
              </Button>
            </Grid>
          </Grid>

        </Stack>
      </Container>

      {openCompose.value && <MailCompose onCloseCompose={openCompose.onFalse} />}
    </>
  );
}
