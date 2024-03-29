import { Box, Button, Grid, Typography } from '@mui/material';
import CardInfoInterview from './components/CardInfoInterview';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { gridSpacing } from 'configs/constant';
import { useState } from 'react';
import ModalHelp from '../components/ModalHelp';

function OnboardingPage() {
    const candidate = useSelector((state) => state.candidate?.candidate);
    const [open, setOpen] = useState(false);

    const nav = useNavigate();

    const handleClickPractice = () => {
        nav('practice');
    };

    const handleClickStartInterview = () => {
        nav(`question/${candidate?.interview_detail?.questions?.[0]?.question_id}`);
    };

    return (
        <Box display="flex" justifyContent="center">
            <Box maxWidth={600} display="flex" justifyContent="center">
                <Grid container justifyContent="center" alignItems="center" direction="column" minHeight="80vh" spacing={gridSpacing}>
                    <Grid item width="100%">
                        <Typography variant="h2" align="center">
                            Selamat datang, Messi!
                        </Typography>
                    </Grid>
                    <Grid item width="100%">
                        <CardInfoInterview interview={candidate} />
                    </Grid>
                    <Grid item width="100%">
                        <Grid container justifyContent="space-between" alignItems="center" direction="row" spacing={gridSpacing}>
                            <Grid item xs={6}>
                                <Button size="large" variant="contained" color="primary" fullWidth onClick={handleClickPractice}>
                                    Latihan Interview
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button size="large" variant="contained" color="secondary" fullWidth onClick={() => setOpen(true)}>
                                    Mulai Interview
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <ModalHelp open={open} setOpen={setOpen} onOk={handleClickStartInterview} />
        </Box>
    );
}

export default OnboardingPage;
