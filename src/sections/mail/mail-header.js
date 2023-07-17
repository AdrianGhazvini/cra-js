import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { RHFSelect } from 'src/components/hook-form';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// axios
import { fetcher, endpoints, getUserImages } from 'src/utils/axios';


export default function MailHeader({
  onOpenNav, 
  onOpenMail, 
  setDisputeLetter, 
  setDisputeItemParent, 
  driversLicenseUrl,
  utilityBillUrl,
  ...other 
}) {
  const methods = useForm();
  const { watch } = methods;
  const [disputeItems, setDisputeItems] = useState([]);
  const [disputeReasons, setDisputeReasons] = useState([]);
  const disputeItem = watch('disputeItem');
  const disputeReason = watch('disputeReason');

  const fetchLetters = async () => {
    try {
      if (disputeItem && disputeReason) {
        if (setDisputeItemParent) {
          setDisputeItemParent(disputeItem);
        }
        const response = await fetcher(`${endpoints.mail.labels}?item=${disputeItem}&reason=${disputeReason}`);
        console.log("1",);
        if (response.labels && response.labels[disputeReason]) {
          let letter = response.labels[disputeReason];
            console.log("2");
            const driversLicenseDataUrl = toDataURL(driversLicenseUrl);
            const utilityBillDataUrl = toDataURL(utilityBillUrl);

            Promise.all([driversLicenseDataUrl, utilityBillDataUrl]).then(([driversLicenseData, utilityBillData]) => {
              letter = `${letter}<img src="${driversLicenseData}">`;
              letter = `${letter}<img src="${utilityBillData}">`;
              setDisputeLetter(letter);
            });
        } else {
          console.error('Dispute reason not found in response:', response);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dispute letter:', error);
    }
  };

  const toDataURL = (url) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = err => reject(err);
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetcher(endpoints.mail.list);
        if (Array.isArray(result.items)) {
          setDisputeItems(result.items);
        } else {
          console.error('Received data is not an array:', result.items);
        }
      } catch (error) {
        console.error('Failed to fetch dispute reasons:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetcher(endpoints.mail.details);
        if (Array.isArray(result.details)) {
          setDisputeReasons(result.details);
        } else {
          console.error('Received data is not an array:', result.details);
        }
      } catch (error) {
        console.error('Failed to fetch dispute reasons:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <FormProvider {...methods}>
      <Stack direction="column" flexGrow={1} spacing={2}>
        <RHFSelect
          label="Dispute Item"
          name="disputeItem"
          placeholder="Pick the item you want to dispute."
        >
          {disputeItems.map((option) => (
            <MenuItem key={option} value={option} style={{ whiteSpace: 'normal' }}>
              {option}
            </MenuItem>
          ))}
        </RHFSelect>

        <RHFSelect
          label="Dispute Reason"
          name="disputeReason"
          placeholder="Pick your dispute reason."
        >
          {disputeReasons.map((option) => (
            <MenuItem key={option} value={option} style={{ whiteSpace: 'normal' }}>
              {option}
            </MenuItem>
          ))}
        </RHFSelect>

        <Button variant="contained"
          color="primary"
          onClick={() => {fetchLetters();}}
          disabled={!disputeItem || !disputeReason}
          style={{ minHeight: '50px', marginBottom: '8px' }}
        >
          Generate Dispute Letter
        </Button>
      </Stack>
    </FormProvider>
  );
}

MailHeader.propTypes = {
  onOpenMail: PropTypes.func,
  onOpenNav: PropTypes.func,
  setDisputeLetter: PropTypes.func,
  setDisputeItemParent: PropTypes.func,
  driversLicenseUrl: PropTypes.string,
  utilityBillUrl: PropTypes.string,
};