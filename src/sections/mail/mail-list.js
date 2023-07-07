import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
//
import { fetcher, endpoints } from 'src/utils/axios';
import { useState, useEffect } from 'react';
import MailItem from './mail-item';


// ----------------------------------------------------------------------

export default function MailList({
  //
  openMail,
  onCloseMail,
  onClickMail,
  //
  selectedLabelId,
  selectedMailId,
}) {
  const [mails, setMails] = useState([]);
  const mdUp = useResponsive('up', 'md');

  useEffect(() => {
    fetcher(endpoints.mail.list)
      .then(data => {
        setMails(data.labels);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const renderList = (
    <>
      {mails.map((mail, index) => (
        <MailItem
          key={index}
          mail={{ message: mail, isUnread: false }}
          selected={selectedMailId === index}
          onClickMail={() => {
            onClickMail(index);
          }}
        />
      ))}
    </>
  );

  const renderContent = (
    <>
      <Scrollbar sx={{ px: 2, py: 2 }}>
        {mails.length > 0 && renderList}
      </Scrollbar>
    </>
  );

  return mdUp ? (
    <Stack
      sx={{
        width: 320,
        flexShrink: 0,
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    >
      {renderContent}
    </Stack>
  ) : (
    <Drawer
      open={openMail}
      onClose={onCloseMail}
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: {
          width: 320,
        },
      }}
    >
      {renderContent}
    </Drawer>
  );
}

MailList.propTypes = {
  onClickMail: PropTypes.func,
  onCloseMail: PropTypes.func,
  openMail: PropTypes.bool,
  selectedLabelId: PropTypes.string,
  selectedMailId: PropTypes.string,
};
