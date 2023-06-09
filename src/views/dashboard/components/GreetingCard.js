import PropTypes from 'prop-types';
import { Box, Button, Grid, Typography, styled } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import GreetingCard from 'components/cards/Skeleton/GreetingCard';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.aivue.secondary500,
    color: '#fff !important',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

function GreetingSection({ isLoading }) {
    const user = useSelector((state) => state.global.user);
    const nav = useNavigate();
    return (
        <>
            {isLoading ? (
                <GreetingCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="h2" color="#fff">
                                    Hi, {user.name}!
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5" color="#fff">
                                    Kelola jadwal dan pertanyaan interview dengan AIVue!
                                </Typography>
                                <Typography variant="h5" color="#fff">
                                    {format(new Date(), 'PPPP', { locale: id })}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Button
                                            sx={{ zIndex: 2 }}
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={() => nav('/candidate/new')}
                                        >
                                            Jadwalkan Interview
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
}

GreetingSection.propTypes = {
    isLoading: PropTypes.bool
};

export default GreetingSection;
