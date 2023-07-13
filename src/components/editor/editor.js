import PropTypes from 'prop-types';
import 'src/utils/highlight';
import ReactQuill from 'react-quill';
import { useEffect, useState, useRef } from 'react';
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
  disputeItemParent,
  driversLicenseUrl,
  utilityBillUrl,
  onContentChange,
  hasAddedImages,
  setHasAddedImages,
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

  const [localValue, setLocalValue] = useState(value);

  const toDataURL = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  useEffect(() => {
    setLocalValue(value.replaceAll('<first_name>', name));
    setLocalValue(value.replaceAll('<credit_item>', disputeItemParent));
  }, [value, name, disputeItemParent]);

  useEffect(() => {
    console.log('hasAddedImages:', hasAddedImages)
    if (localValue && quillRef.current && !hasAddedImages) {
      (async () => {
        toDataURL(driversLicenseUrl, (dataUrl) => {
          setLocalValue(prevLocalValue => `${prevLocalValue}<img src="${dataUrl}">`);
        });

        toDataURL(utilityBillUrl, (dataUrl) => {
          setLocalValue(prevLocalValue => `${prevLocalValue}<img src="${dataUrl}">`);
        });

        setHasAddedImages(true); // set hasAddedImages to true after adding the images
      })();
    }
  }, [localValue, driversLicenseUrl, utilityBillUrl, setHasAddedImages, hasAddedImages, quillRef]);

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
          value={localValue}
          modules={modules}
          formats={formats}
          placeholder="Your dispute letter will be generated here..."
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
  disputeItemParent: PropTypes.string,
  driversLicenseUrl: PropTypes.string,
  utilityBillUrl: PropTypes.string,
  onContentChange: PropTypes.func,
  hasAddedImages: PropTypes.bool,
  setHasAddedImages: PropTypes.func,
};
