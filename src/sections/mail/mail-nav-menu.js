import React from 'react';
import { useTheme, useMediaQuery, IconButton, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export default function MailNavMenu({ onOpenNav }) {
    const theme = useTheme();
    const isUpMd = useMediaQuery(theme.breakpoints.up('md'));

    return isUpMd ? (
        <Stack
            sx={{
                width: 320,
                flexShrink: 0,
                borderRadius: 1.5,
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <Typography
                noWrap
                variant="subtitle2"
                component="span"
                color="text.primary">
                Dispute Items:
            </Typography>
        </Stack >
    ) : (
        <IconButton onClick={onOpenNav}>
            <Iconify icon="solar:chat-round-dots-bold" />
        </IconButton>
    );
}
MailNavMenu.propTypes = {
    onOpenNav: PropTypes.func,
};
