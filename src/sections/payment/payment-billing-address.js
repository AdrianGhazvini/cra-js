// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// locales
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function PaymentBillingAddress() {
  const { t } = useLocales();
  return (
    <div>
      <Typography variant="h6">{t('billing_address')}</Typography>

      <Stack spacing={3} mt={5}>
        <TextField fullWidth label={t('name_on_card')} />
        <TextField fullWidth label={t('street_address')} />
        <TextField fullWidth label={t('city')} />
        <TextField fullWidth label={t('state')} />
        <TextField fullWidth label={t('zip_code')} />
        <Button variant="contained"
          color="primary"
          style={{ minHeight: '50px', marginBottom: '8px' }}
        >
          {t('save_billing_address')}
        </Button>
      </Stack>
    </div>
  );
}
