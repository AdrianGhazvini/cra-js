import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

// ----------------------------------------------------------------------

export default function MailItem({ mail, selected, onClickMail, sx, ...other }) {
  return (
    <ListItemButton
      onClick={onClickMail}
      sx={{
        p: 1,
        mb: 0.5,
        borderRadius: 1,
        ...(selected && {
          bgcolor: 'action.selected',
        }),
        ...sx,
      }}
      {...other}
    >
      <>
        <ListItemText
          primaryTypographyProps={{
            noWrap: true,
            variant: 'subtitle2',
          }}
          secondary={mail.message}
          secondaryTypographyProps={{
            noWrap: true,
            component: 'span',
            variant: mail.isUnread ? 'subtitle2' : 'body2',
            color: mail.isUnread ? 'text.primary' : 'text.secondary',
          }}
        />
      </>
    </ListItemButton>
  );
}

MailItem.propTypes = {
  mail: PropTypes.object,
  onClickMail: PropTypes.func,
  selected: PropTypes.bool,
  sx: PropTypes.object,
};
