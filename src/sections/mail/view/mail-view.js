import React, { useEffect, useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hook';
// api
import { useGetLabels, useGetMails, useGetMail } from 'src/api/mail';
// components
import EmptyContent from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
//
import Editor from 'src/components/editor';
import MailList from '../mail-list';
import MailHeader from '../mail-header';
import MailCompose from '../mail-compose';
import MailDetails from '../mail-details';


// ----------------------------------------------------------------------

const LABEL_INDEX = 'inbox';

export default function MailView() {
  const router = useRouter();

  const { user } = useMockedUser();

  const searchParams = useSearchParams();

  const selectedLabelId = searchParams.get('label') || LABEL_INDEX;

  const selectedMailId = searchParams.get('id') || '';

  const upMd = useResponsive('up', 'md');

  const [letter, setLetter] = useState("");

  const settings = useSettingsContext();

  const openNav = useBoolean();

  const openMail = useBoolean();

  const openCompose = useBoolean();

  const { labels, labelsLoading } = useGetLabels();

  const { mails, mailsLoading, mailsError } = useGetMails(selectedLabelId);
  const mailsEmpty = mails.length === 0;

  const { mail, mailLoading, mailError } = useGetMail(selectedMailId);

  const firstMailId = mails.allIds[0] || '';

  const [disputeLetter, setDisputeLetter] = useState("");

  const handleClickMail = useCallback(
    (mailId) => {
      if (!upMd) {
        openMail.onFalse();
      }

      const href =
        selectedLabelId !== LABEL_INDEX
          ? `${paths.dashboard.mail}?id=${mailId}&label=${selectedLabelId}`
          : `${paths.dashboard.mail}?id=${mailId}`;

      router.push(href);
    },
    [openMail, router, selectedLabelId, upMd]
  );

  useEffect(() => {
    if (mailsError || mailError) {
      router.push(paths.dashboard.mail);
    }
  }, [mailError, mailsError, router]);

  useEffect(() => {
    if (!selectedMailId && firstMailId) {
      handleClickMail(firstMailId);
    }
  }, [firstMailId, handleClickMail, selectedMailId]);

  useEffect(() => {
    if (openCompose.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [openCompose.value]);

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  const renderEmpty = (
    <EmptyContent
      title={`Nothing in ${selectedLabelId}`}
      description="This folder is empty"
      imgUrl="/assets/icons/empty/ic_folder_empty.svg"
      sx={{
        borderRadius: 1.5,
        maxWidth: { md: 320 },
        bgcolor: 'background.default',
      }}
    />
  );

  const renderMailList = (
    <MailList
      mails={mails}
      loading={mailsLoading}
      //
      openMail={openMail.value}
      onCloseMail={openMail.onFalse}
      onClickMail={handleClickMail}
      //
      selectedLabelId={selectedLabelId}
      selectedMailId={selectedMailId}
    />
  );

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
              onOpenMail={mailsEmpty ? null : openMail.onTrue}
              setDisputeLetter={setDisputeLetter}
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
              }}
            >
              <Editor
                id="reply-mail"
                value={disputeLetter}
                name={user?.displayName}
              />
          </Stack>
        </Stack>
      </Container>

      {openCompose.value && <MailCompose onCloseCompose={openCompose.onFalse} />}
    </>
  );
}
