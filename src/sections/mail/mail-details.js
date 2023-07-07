import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Editor from 'src/components/editor';
import EmptyContent from 'src/components/empty-content';
import { StyledStack } from 'src/components/editor/styles';

// ----------------------------------------------------------------------

export default function MailDetails({ mail, renderLabel }) {
  const showAttachments = useBoolean(true);

  const renderEditor = (
    <StyledStack
      spacing={2}
      sx={{
        p: (theme) => theme.spacing(2, 2, 2, 2),
      }}
    >
      <Editor simple id="reply-mail" />
    </StyledStack>
  );

  return (
    <Stack
      flexGrow={1}
      sx={{
        width: 1,
        minWidth: 0,
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    >

      {renderEditor}
    </Stack>
  );
}

MailDetails.propTypes = {
  mail: PropTypes.object,
  renderLabel: PropTypes.func,
};
