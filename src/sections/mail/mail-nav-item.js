import PropTypes from 'prop-types';
// @mui
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

// ----------------------------------------------------------------------

const LABEL_ICONS = {
  all: 'fluent:mail-24-filled',
  inbox: 'solar:inbox-bold',
  trash: 'solar:trash-bin-trash-bold',
  drafts: 'solar:file-text-bold',
  spam: 'solar:danger-bold',
  sent: 'iconamoon:send-fill',
  starred: 'eva:star-fill',
  important: 'material-symbols:label-important-rounded',
  social: 'solar:tag-horizontal-bold-duotone',
  promotions: 'solar:tag-horizontal-bold-duotone',
  forums: 'solar:tag-horizontal-bold-duotone',
};

// ----------------------------------------------------------------------

export default function MailNavItem({ selected, label, onClickNavItem, ...other }) {
  const { unreadCount, color, name } = label;

  const labelIcon = LABEL_ICONS[label.id];

  return (
    <ListItemButton
      disableRipple
      onClick={onClickNavItem}
      sx={{
        px: 0,
        height: 40,
        color: 'text.secondary',
        ...(selected && {
          color: 'text.primary',
        }),
        '&:hover': {
          bgcolor: 'transparent',
        },
      }}
      {...other}
    >
      <ListItemText
        primary={name}
        primaryTypographyProps={{
          textTransform: 'capitalize',
          typography: selected ? 'subtitle2' : 'body2',
        }}
      />
    </ListItemButton>
  );
}

MailNavItem.propTypes = {
  selected: PropTypes.bool,
  label: PropTypes.object,
  onClickNavItem: PropTypes.func,
};
