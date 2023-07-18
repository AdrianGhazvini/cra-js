import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
// _mock
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from 'src/_mock';
// locales
import { useLocales } from 'src/locales';
// components
import axios, { endpoints } from 'src/utils/axios';
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';

import { Link } from 'react-router-dom';
import CircularProgressWithLabel from './circular-progress-with-label';
import AppWelcome from '../app-welcome';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { t } = useLocales();

  const [user, setUser] = useState(null); 

  const theme = useTheme();

  const settings = useSettingsContext();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(endpoints.auth.me);

        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getUserData();
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <AppWelcome
            title={`${t('welcome_back')} 👋 \n ${user ? user.first_name : ""}`}
            description={t('welcome_back_description')}
            img={<SeoIllustration />}
            action={
              <Link to="/dashboard/analytics" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                 {t('view_report')}
                </Button>
              </Link>
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CircularProgressWithLabel value={650} title="Transunion"/>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <CircularProgressWithLabel value={720} title="Equifax"/>
        </Grid>

        <Grid item xs={12} md={4}>
          <CircularProgressWithLabel value={800} title="Experian"/>
        </Grid>

        <Grid item xs={12} md={4}>
          <AppWidgetSummary
            title="Transunion"
            points={25}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <AppWidgetSummary
            title="Equifax"
            points={42}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <AppWidgetSummary
            title="Experian"
            points={-3}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <AppAreaInstalled
            title={t('credit_history')}
            subheader={`43% ${t('higher_than_last_year')}`}
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
                      "name": "TransUnion",
                      "data": [540, 560, 580, 610, 590, 570, 560, 580, 600, 620, 640, 660]
                    },
                    {
                      "name": "Equifax",
                      "data": [550, 570, 595, 615, 595, 575, 580, 600, 620, 640, 660, 680]
                    },
                    {
                      "name": "Experian",
                      "data": [560, 580, 600, 620, 600, 580, 590, 610, 630, 650, 670, 690]
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
