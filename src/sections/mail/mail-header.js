import React, { useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
// components
import PropTypes from 'prop-types';
import { useForm , Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function MailHeader({ onOpenNav, onOpenMail, setDisputeLetter, ...other }) {
  const methods = useForm();
  const [disputeItems, setDisputeItems] = useState([]);
  const [disputeReasons, setDisputeReasons] = useState([]);
  const { control, watch } = useForm();
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
    <Stack direction="column" flexGrow={1} spacing={2}>
      <Controller
        name="disputeItem"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            select
            fullWidth
            label="Dispute Item"
            placeholder="Pick the item you want to dispute."
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            {...field}
          >
            {disputeItems.map((option) => (
              <MenuItem key={option} value={option} style={{ whiteSpace: 'normal' }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="disputeReason"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            select
            fullWidth
            label="Dispute Reason"
            placeholder="Pick your dispute reason."
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            {...field}
          >
            {disputeReasons.map((option) => (
              <MenuItem key={option} value={option} style={{ whiteSpace: 'normal' }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Button variant="contained" color="primary" onClick={fetchLetters} disabled={!disputeItem || !disputeReason}>
        Generate Dispute Letter
      </Button>
    </Stack>
  );
}
MailHeader.propTypes = {
  onOpenMail: PropTypes.func,
  onOpenNav: PropTypes.func,
  setDisputeLetter: PropTypes.func
};