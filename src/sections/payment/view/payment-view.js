// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// locales
import { useLocales } from 'src/locales';
//
import PaymentMethods from '../payment-methods';
import PaymentBillingAddress from '../payment-billing-address';

// ----------------------------------------------------------------------

export default function PaymentView() {
  const { t } = useLocales();
  return (
    <Container
      sx={{
        pt: 15,
        pb: 10,
        minHeight: 1,
      }}
    >
      <Typography variant="h3" align="center" paragraph>
        {t('payment')}
      </Typography>

      <Grid container rowSpacing={{ xs: 5, md: 0 }} columnSpacing={{ xs: 0, md: 5 }}>
        <Grid xs={12} md={12}>
          <Box
            gap={5}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            }}
            sx={{
              p: { md: 5 },
              borderRadius: 2,
              border: (theme) => ({
                md: `dashed 1px ${theme.palette.divider}`,
              }),
            }}
          >
            <PaymentMethods />
            <PaymentBillingAddress />    
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
