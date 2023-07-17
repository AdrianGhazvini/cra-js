import PropTypes from 'prop-types';
import 'src/utils/highlight';
import ReactQuill from 'react-quill';
// @mui
import { alpha } from '@mui/material/styles';
//
import { StyledEditor } from './styles';
import Toolbar, { formats } from './toolbar';

// ----------------------------------------------------------------------

export default function Editor({
  id = 'minimal-quill',
  quillRef,
  error,
  simple = false,
  helperText,
  value,
  name,
  onContentChange,
  placeholder,
  sx,
  ...other
}) {
  const modules = {
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <>
      <StyledEditor
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
            '& .ql-editor': {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            },
          }),
          ...sx,
        }}
      >
        <Toolbar id={id} isSimple={simple} />

        <ReactQuill
          ref={quillRef}
          value={value}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          onChange={onContentChange}
          {...other}
        />
      </StyledEditor>
      {helperText && helperText}
    </>
  );
}

Editor.propTypes = {
  quillRef: PropTypes.object,
  error: PropTypes.bool,
  helperText: PropTypes.object,
  id: PropTypes.string,
  simple: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string,
  name: PropTypes.string,
  onContentChange: PropTypes.func,
  placeholder: PropTypes.string,
};
