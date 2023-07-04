// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// _mock
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';

import { Link } from 'react-router-dom';
import CircularProgressWithLabel from './circular-progress-with-label';
import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppTopInstalledCountries from '../app-top-installed-countries';



// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.firstName}`}
            description="Stay a step ahead with real-time credit score updates."
            img={<SeoIllustration />}
            action={
              <Link to="/dashboard/analytics" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Go Now
                </Button>
              </Link>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid xs={12} md={4}>
          <CircularProgressWithLabel value={650} title="Transunion"/>
        </Grid>
        
        <Grid xs={12} md={4}>
          <CircularProgressWithLabel value={720} title="Equifax"/>
        </Grid>

        <Grid xs={12} md={4}>
          <CircularProgressWithLabel value={800} title="Experian"/>
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Transunion"
            points={25}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Equifax"
            points={42}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Experian"
            points={-3}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Credit History"
            subheader="43% higher than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'America',
                      data: [450, 470, 510, 560, 650, 530, 480, 530, 580, 620, 670, 710],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
