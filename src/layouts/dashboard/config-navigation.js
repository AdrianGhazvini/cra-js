import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  support: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      {
        items: [
          { title: t('app'), path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: t('analytics'), path: paths.dashboard.general.analytics, icon: ICONS.analytics },
          {
            title: t('file_manager'),
            path: paths.dashboard.fileManager,
            icon: ICONS.file,
          },
          {
            title: t('mail'),
            path: paths.dashboard.mail,
            icon: ICONS.mail,
          },
          {
            title: t('letter_manager'),
            path: paths.dashboard.letterManager,
            icon: ICONS.folder,
          },
          {
            title: t('billing'),
            path: paths.dashboard.billing,
            icon: ICONS.invoice,
          },
          { title: t('blank'), path: paths.dashboard.blank, icon: ICONS.support },
        ],
      },
    ],
    [t]
  );
  return data;
}
