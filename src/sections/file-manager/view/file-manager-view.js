import { useState, useCallback, useEffect } from 'react';
import { endpoints, fetcher } from 'src/utils/axios';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { _allFiles, FILE_TYPE_OPTIONS } from 'src/_mock/_files';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import FileThumbnail, { fileFormat } from 'src/components/file-thumbnail';
//
import FileManagerTable from '../file-manager-table';
import FileManagerFilters from '../file-manager-filters';
import FileManagerFiltersResult from '../file-manager-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  type: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function FileManagerView() {
  const driver_license_table = useTable({ defaultRowsPerPage: 10 });
  const utility_bills_table = useTable({ defaultRowsPerPage: 10 });

  const settings = useSettingsContext();

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const upload_bill = useBoolean();
  const upload_license = useBoolean();

  const [view, setView] = useState('list');

  const [driversLicenseTableData, setDriversLicenseTableData] = useState([]);
  const [utilityBillsTableData, setUtilityBillsTableData] = useState([]);

  const { user } = useMockedUser();

  useEffect(() => {
    const fetchImages = async () => {
      const user_id = user?.id;

      // Call the get function with the user_id to get the URL
      const url = endpoints.user_images.get(user_id);

      const data = await fetcher(url);

      if (data.drivers_license) {
        data.drivers_license = `http://localhost:8000${data.drivers_license}`;
        const driversLicenseData = {
          id: 'driver_license_file',
          name: 'drivers_license.jpg',
          url: data.drivers_license,
          size: 0,
        };
        setDriversLicenseTableData([driversLicenseData]);
      }

      if (data.utility_bill) {
        data.utility_bill = `http://localhost:8000${data.utility_bill}`;
        const utilityBillsData = {
          id: 'utility_bill_file',
          name: 'utility_bill.jpg',
          url: data.utility_bill,
          size: 0,
        };
        setUtilityBillsTableData([utilityBillsData]);
      }
    }

    fetchImages();
  }, [user?.id]);

  const refreshImages = async () => {
    // Fetch images code
    const user_id = user?.id;

    // Call the get function with the user_id to get the URL
    const url = endpoints.user_images.get(user_id);

    const data = await fetcher(url);

    if (data.drivers_license) {
        data.drivers_license = `http://localhost:8000${data.drivers_license}`;
    }

    if (data.utility_bill) {
        data.utility_bill = `http://localhost:8000${data.utility_bill}`;
    }

    const driversLicenseData = {
        id: 'driver_license_file', 
        name: 'drivers_license.jpg', 
        url: data.drivers_license,
        size: 0, 
    };

    const utilityBillsData = {
        id: 'utility_bill_file', 
        name: 'utility_bill.jpg',
        url: data.utility_bill,
        size: 0, 
    };

    setDriversLicenseTableData([driversLicenseData]);
    setUtilityBillsTableData([utilityBillsData]);
}

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const driversLicenseDataFiltered = applyFilter({
    inputData: driversLicenseTableData,
    comparator: getComparator(driver_license_table.order, driver_license_table.orderBy),
    filters,
    dateError,
  });

  const driversLicenseDataInPage = driversLicenseDataFiltered.slice(
    driver_license_table.page * driver_license_table.rowsPerPage,
    driver_license_table.page * driver_license_table.rowsPerPage + driver_license_table.rowsPerPage
  );

  const utilityBillsDataFiltered = applyFilter({
    inputData: utilityBillsTableData,
    comparator: getComparator(utility_bills_table.order, utility_bills_table.orderBy),
    filters,
    dateError,
  });

  const utilityBillsDataInPage = utilityBillsDataFiltered.slice(
    utility_bills_table.page * utility_bills_table.rowsPerPage,
    utility_bills_table.page * utility_bills_table.rowsPerPage + utility_bills_table.rowsPerPage
  );

  const canReset =
    !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!driversLicenseDataFiltered.length && canReset) || !driversLicenseDataFiltered.length;

  const handleChangeView = useCallback((event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  }, []);

  const handleFilters = useCallback(
    (name, value) => {
      driver_license_table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [driver_license_table]
  );

  const handleDeleteDriversLicenseItem = useCallback(
    (id) => {
      const deleteRow = driversLicenseTableData.filter((row) => row.id !== id);
      setDriversLicenseTableData(deleteRow);

      driver_license_table.onUpdatePageDeleteRow(driversLicenseDataInPage.length);
    },
    [driversLicenseDataInPage.length, driver_license_table, driversLicenseTableData]
  );

  const handleDeleteDriversLicenseItems = useCallback(() => {
    const deleteRows = driversLicenseTableData.filter((row) => !driver_license_table.selected.includes(row.id));
    setDriversLicenseTableData(deleteRows);

    driver_license_table.onUpdatePageDeleteRows({
      totalRows: driversLicenseTableData.length,
      totalRowsInPage: driversLicenseDataInPage.length,
      totalRowsFiltered: driversLicenseDataFiltered.length,
    });
  }, [driversLicenseDataFiltered.length, driversLicenseDataInPage.length, driver_license_table, driversLicenseTableData]);

  const handleDeleteUtilityBillItem = useCallback(
    (id) => {
      const deleteRow = utilityBillsTableData.filter((row) => row.id !== id);
      setUtilityBillsTableData(deleteRow);

      utility_bills_table.onUpdatePageDeleteRow(utilityBillsDataInPage.length);
    },
    [utilityBillsDataInPage.length, utility_bills_table, utilityBillsTableData]
  );

  const handleDeleteUtilityBillItems = useCallback(() => {
    const deleteRows = utilityBillsTableData.filter((row) => !utility_bills_table.selected.includes(row.id));
    setUtilityBillsTableData(deleteRows);

    utility_bills_table.onUpdatePageDeleteRows({
      totalRows: utilityBillsTableData.length,
      totalRowsInPage: utilityBillsDataInPage.length,
      totalRowsFiltered: utilityBillsDataFiltered.length,
    });
  }, [utilityBillsDataFiltered.length, utilityBillsDataInPage.length, utility_bills_table, utilityBillsTableData]);


  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <FileManagerFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        typeOptions={FILE_TYPE_OPTIONS}
      />
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={driversLicenseDataFiltered.length}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography variant="h4">Documents</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
              onClick={upload_license.onTrue}
              sx={{ mt: 3, minWidth: 203, minHeight: 40, width: '100%'}}
              color='primary'
            >
              Upload Drivers License
            </Button>
            {notFound ? (
              <EmptyContent
                filled
                title="No Data"
                sx={{
                  py: 10,
                }}
              />
            ) : (
              <>
                <FileManagerTable
                  table={driver_license_table}
                  tableData={driversLicenseTableData}
                  dataFiltered={driversLicenseDataFiltered}
                  onDeleteRow={handleDeleteDriversLicenseItem}
                  notFound={notFound}
                  onOpenConfirm={confirm.onTrue}
                />
              </>
            )}
            <Stack
              spacing={2.5}
              justifyContent="center"
              sx={{
                p: 2.5,
                bgcolor: 'background.default',
              }}
            >
              {driversLicenseDataFiltered
                .map((row) => (
                  <FileThumbnail
                    file={row}
                    imageView
                    sx={{ width: 64, height: 64 }}
                    imgSx={{ borderRadius: 1 }}
                  />
                ))}
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
              onClick={upload_bill.onTrue}
              sx={{ mt: 3, minWidth: 203, minHeight: 40, width: '100%' }}
              color='primary'
            >
              Upload Utility Bill
            </Button>
            {notFound ? (
              <EmptyContent
                filled
                title="No Data"
                sx={{
                  py: 10,
                }}
              />
            ) : (
              <>
                <FileManagerTable
                  table={utility_bills_table}
                  tableData={utilityBillsTableData}
                  dataFiltered={utilityBillsDataFiltered}
                  onDeleteRow={handleDeleteUtilityBillItem}
                  notFound={notFound}
                  onOpenConfirm={confirm.onTrue}
                />
              </>
            )}
            <Stack
              spacing={2.5}
              justifyContent="center"
              sx={{
                p: 2.5,
                bgcolor: 'background.default',
              }}
            >
              {utilityBillsDataFiltered
                .map((row) => (
                  <FileThumbnail
                    file={row}
                    imageView
                    sx={{ width: 64, height: 64 }}
                    imgSx={{ borderRadius: 1 }}
                  />
                ))}
            </Stack>
          </Grid>
        </Grid>
        
      </Container>

      <FileManagerNewFolderDialog open={upload_license.value} onClose={upload_license.onFalse} fileType="drivers_license" refreshImages={refreshImages} />
      <FileManagerNewFolderDialog open={upload_bill.value} onClose={upload_bill.onFalse} fileType="utility_bill" refreshImages={refreshImages} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete
            <strong> {driver_license_table.selected.length + utility_bills_table.selected.length} </strong>
            items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteDriversLicenseItems();
              handleDeleteUtilityBillItems();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, type, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (type.length) {
    inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (file) =>
          fTimestamp(file.createdAt) >= fTimestamp(startDate) &&
          fTimestamp(file.createdAt) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
