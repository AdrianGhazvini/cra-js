import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
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

  const [rotation, setRotation] = useState(0);

  const handleUpload = async () => {
  // Exit early if no files are selected
  if (files.length === 0) {
    return;
  }

  const image = document.createElement('img');
  image.src = files[0].preview;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (rotation % 180 === 0) {
    canvas.width = image.width;
    canvas.height = image.height;
  } else {
    canvas.width = image.height;
    canvas.height = image.width;
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  canvas.toBlob((blob) => {
    const file = new File([blob], files[0].name, { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file0', file);
    formData.append('user_id', user?.id);
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
  }, 'image/jpeg');

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

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxHeight: '100%', maxWidth: '100%' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        {files.length > 0 ? (
          <>
            <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '50%'}}>
              <Button onClick={() => setRotation(rotation - 90)} startIcon={<Iconify icon="ant-design:rotate-left-outlined" />} />
              <Button onClick={() => setRotation(rotation + 90)} startIcon={<Iconify icon="ant-design:rotate-right-outlined" />} />
            </Stack>
            <Box sx={{ minHeight: '300px' ,width: '100%', height: '100%', flexGrow: '1', display: 'grid', alignContent: 'space-around', justifyContent: 'center', alignItems: 'center', justifyItems: 'center' ,overflow: 'auto' }}>
                <img
                style={{ maxWidth: '80%', maxHeight: '100%', objectFit: 'contain', transform: `rotate(${rotation}deg)` }}
                  src={files[0].preview}
                  alt="Preview"
               />
            </Box>
          </>
        ) : (
          <Upload files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
        )}
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
            Remove
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