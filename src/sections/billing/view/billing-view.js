// components
import { useSettingsContext } from 'src/components/settings';
// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------

export default function BillingView() {

  const settings = useSettingsContext();
  
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Billing
      </Typography>
    </Container>
  );
}
