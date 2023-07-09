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


export default function MailHeader({ onOpenNav, onOpenMail, setDisputeLetter, ...other }) {
  const methods = useForm();
  const { watch } = methods;
  const [disputeItems, setDisputeItems] = useState([]);
  const [disputeReasons, setDisputeReasons] = useState([]);
  const disputeItem = watch('disputeItem');
  const disputeReason = watch('disputeReason');

  const fetchLetters = async () => {
    try {
      if (disputeItem && disputeReason) {
        const response = await fetcher(`${endpoints.mail.labels}?item=${disputeItem}&reason=${disputeReason}`);
        if (response.labels && response.labels[disputeReason]) {
          setDisputeLetter(response.labels[disputeReason]); // Use setLetter to update the letter in the parent state
        } else {
          console.error('Dispute reason not found in response:', response);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dispute letter:', error);
    }
  };

  const { user } = useMockedUser();

  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const userId = user?.id;
        const images = await getUserImages(userId);
        if (images.drivers_license && images.utility_bill) {
          console.log("Driver's License: ", `http://localhost:8000${images.drivers_license}`);
          console.log("Utility Bill: ", `http://localhost:8000${images.utility_bill}`);
        } else {
          console.error('User images not found');
        }
      } catch (error) {
        console.error('Failed to fetch user images:', error);
      }
    };
    fetchUserImages();
  }, [user?.id]);

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
        onClick={fetchLetters} 
        disabled={!disputeItem || !disputeReason}
        style={{ minHeight: '50px' , marginBottom: '8px' }}
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
  setDisputeLetter: PropTypes.func
};