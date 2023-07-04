import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
// components
import Image from 'src/components/image';
import { MotionContainer, varFade } from 'src/components/animate';
import Carousel, { CarouselDots, CarouselArrows, useCarousel } from 'src/components/carousel';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function AppFeatured({ list, ...other }) {
  const carousel = useCarousel({
    speed: 6500,
    autoplay: true,
    ...CarouselDots({
      sx: {
        top: 16,
        left: 16,
        position: 'absolute',
        color: 'white',
      },
    }),
  });

  return (
    <Card {...other}>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {list.map((app, index) => (
          <CarouselItem key={app.id} item={app} active={index === carousel.currentIndex} />
        ))}
      </Carousel>

      <CarouselArrows
        onNext={carousel.onNext}
        onPrev={carousel.onPrev}
        sx={{ top: 8, right: 8, position: 'absolute', color: 'common.white' }}
      />
    </Card>
  );
}

AppFeatured.propTypes = {
  list: PropTypes.array,
};

// ----------------------------------------------------------------------

function CarouselItem({ item, active }) {
  const theme = useTheme();

  const { coverUrl, title } = item;

  const renderImg = (
    <Image
      alt={title}
      src={coverUrl}
      overlay={`linear-gradient(to bottom, ${alpha('#004B50', 0)} 0%, ${alpha('#004B50', 1)} 75%)`}

      sx={{
        width: 1,
        height: {
          xs: 280,
          xl: 320,
        },
      }}
    />
  );

  return (
    <MotionContainer action animate={active} sx={{ position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          width: 1,
          height: 1,  // Fill entire parent height
          position: 'absolute',
          zIndex: 9,
          textAlign: 'center', // center align the paragraph
          color: 'common.white', // text color is white
        }}
      >
        <m.div variants={varFade().inRight}>
          <Typography variant="h5" sx={{ color: 'common.white', overflowWrap: 'break-word' }}>
            {title} 
          </Typography>
        </m.div>
      </Box>

      {renderImg}
    </MotionContainer>
  );
}

CarouselItem.propTypes = {
  active: PropTypes.bool,
  item: PropTypes.object,
};
