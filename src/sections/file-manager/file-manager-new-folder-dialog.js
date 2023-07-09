import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';
// axios
import axios from 'axios';

// ----------------------------------------------------------------------

export default function FileManagerNewFolderDialog({
  title = 'Upload Files',
  open,
  onClose,
  fileType,
  //
  onCreate,
  onUpdate,
  //
  folderName,
  onChangeFolderName,
  refreshImages,
  ...other
}) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  function getButtonLabel() {
    if (fileType === "drivers_license") {
      return "Upload Driver's License";
    } if (fileType === "utility_bill") {
      return "Upload Utility Bill";
    }
    return "Upload";
  }

  const handleDrop = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles.filter((file) => file.type.startsWith('image/'))[0];
    if (newFile) {
      const file = Object.assign(newFile, {
        preview: URL.createObjectURL(newFile),
      });

      setFiles([file]);  // only keep the most recent file
    }
  }, []);


  const { user } = useMockedUser();

  const handleUpload = () => {
    const formData = new FormData();

    if (files.length === 0) {
      return; // Exit early if no files are selected
    }

    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    formData.append('user_id', user?.id );
    formData.append('file_type', fileType);

    axios
      .post('http://localhost:8000/api/user-images/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data);
        refreshImages();
      })
      .catch((error) => {
        console.log(error.response.data);
      });

    onClose();
    console.info('ON UPLOAD');
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        <Upload files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
          color='primary'
          disabled={files.length === 0}
        >
          {getButtonLabel(fileType)}      
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}

FileManagerNewFolderDialog.propTypes = {
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  fileType: PropTypes.string,
  refreshImages: PropTypes.func,
};
