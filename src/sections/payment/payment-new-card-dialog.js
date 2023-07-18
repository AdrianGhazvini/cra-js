import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
// locales
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PaymentNewCardDialog({ onClose, ...other }) {
  const popover = usePopover();
  const { t } = useLocales();

  return (
    <>
      <Dialog maxWidth="sm" onClose={onClose} {...other}>
        <DialogTitle> {t('new_card')} </DialogTitle>

        <DialogContent sx={{ overflow: 'unset' }}>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              label={t('card_number')}
              placeholder="XXXX XXXX XXXX XXXX"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label={t('card_holder_name')}
              placeholder="JOHN DOE"
              InputLabelProps={{ shrink: true }}
            />

            <Stack spacing={2} direction="row">
              <TextField
                label={t('expiration_date')}
                placeholder="MM/YY"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label={t('cvv_cvc')}
                placeholder="***"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" edge="end" onClick={popover.onOpen}>
                        <Iconify icon="eva:info-outline" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: 'caption', color: 'text.disabled' }}
            >
              <Iconify icon="carbon:locked" sx={{ mr: 0.5 }} />
              {t('ssl_security_message')}
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>

          <Button variant="contained" onClick={onClose}>
            {t('add')}
          </Button>
        </DialogActions>
      </Dialog>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ maxWidth: 200, typography: 'body2', textAlign: 'center' }}
      >
        {t('cvv_explanation')}
      </CustomPopover>
    </>
  );
}

PaymentNewCardDialog.propTypes = {
  onClose: PropTypes.func,
};
