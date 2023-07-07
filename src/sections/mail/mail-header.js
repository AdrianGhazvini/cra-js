import React, { useEffect, useState } from 'react';
// @mui
import MenuItem from '@mui/material/MenuItem';
// components
import PropTypes from 'prop-types';
import { RHFSelect } from 'src/components/hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function MailHeader({ onOpenNav, onOpenMail, ...other }) {
  const methods = useForm();
  const [disputeReasons, setDisputeReasons] = useState([]);

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
      <RHFSelect
        fullWidth
        name="status"
        label="Dispute Reason"
        placeholder="Pick your dispute reason."
        InputLabelProps={{ shrink: true }}
        sx={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: 'none',
          boxShadow: 'none', 
        }}
      >
        <MenuItem value="" disabled>
          Pick your dispute reason.
        </MenuItem>
        {disputeReasons.map((option) => (
          <MenuItem key={option} value={option} style={{ whiteSpace: 'normal' }}>
            {option}
          </MenuItem>
        ))}
      </RHFSelect>
    </FormProvider>
  );
}

MailHeader.propTypes = {
  onOpenMail: PropTypes.func,
  onOpenNav: PropTypes.func,
};
