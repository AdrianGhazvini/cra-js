import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

export default function CircularProgressWithLabel({ value, title }) {
    let rating;
    let circleColor;

    if (value <= 600) {
        rating = "Needs Work";
        circleColor = '#D21937';
    } else if (value <= 650) {
        rating = "Fair";
        circleColor = '#FF8303';
    } else if (value <= 720) {
        rating = "Good";
        circleColor = '#FFD324';
    } else if (value <= 800) {
        rating = "Very Good";
        circleColor = '#5BE49B';
    } else {
        rating = "Excellent";
        circleColor = '#007867';
    }

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', height: 'auto', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ alignSelf: 'start', ml: 2, p: 3 }}>
                <Typography variant="h5">{title}</Typography>
            </Box>
            <Box
                position="relative"
                display="inline-flex"
            >
                <CircularProgress
                    variant="determinate"
                    value={(value - 350) * 100 / 730} // adjust calculation
                    size={250}
                    thickness={2.5}
                    style={{ color: circleColor, transform: 'rotate(135deg)' }} // Rotate the circle by 135 degrees
                    sx={{
                        '& .MuiCircularProgress-svg': {
                            strokeLinecap: 'round',
                        },
                    }}
                />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                >
                    <Typography variant="h4" component="div" color="text.secondary">
                        {value}
                    </Typography>
                    <Typography variant="subtitle1" component="div" color="text.secondary">
                        {rating}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
}

CircularProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
    title: PropTypes.string,
};
