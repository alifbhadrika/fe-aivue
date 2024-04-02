import { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Grid,
    Stack,
    TextField,
    Typography,
    InputLabel,
    IconButton,
    InputAdornment,
    FormHelperText,
    FormControl,
    Tooltip,
    Autocomplete
} from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { gridSpacing } from 'configs/constant';
import { IconInfoCircle } from '@tabler/icons';
import { defaultValues, candidateSchema } from 'utils/schema/candidate';
import { getAllPositions } from 'utils/api/position';
import { getAllUsers } from 'utils/api/user';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FileUploader from 'components/FileUploader';
import { createCandidate } from 'utils/api/candidate';
import { useDispatch } from 'react-redux';
import { SET_NOTIFICATION } from 'store/actions';
import { generateNotification } from 'utils/notification';
import CircularLoader from 'components/CircularLoader';

function FormCandidatePage() {
    const dispatch = useDispatch();
    const [positionList, setPositionList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [cv, setCv] = useState();

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(candidateSchema),
        defaultValues
    });

    const getPositionList = async () => {
        try {
            const { data } = await getAllPositions();
            setPositionList(data);
        } catch (error) {
            dispatch({ type: SET_NOTIFICATION, notification: generateNotification(error) });
        }
    };

    const getUserList = async () => {
        try {
            const { data } = await getAllUsers();
            setUserList(data);
        } catch (error) {
            dispatch({ type: SET_NOTIFICATION, notification: generateNotification(error) });
        }
    };

    useEffect(() => {
        getPositionList();
        getUserList();
    }, []);

    const onSubmit = async ({ name, email, position, pic, expiredDuration, startDateTime }) => {
        setLoading(true);
        try {
            const payloadFormData = new FormData();
            payloadFormData.append('cv', cv);
            payloadFormData.append('name', name);
            payloadFormData.append('email', email);
            payloadFormData.append('position_id', position.id);
            payloadFormData.append('pic_id', pic.id);
            payloadFormData.append('expired_duration', expiredDuration);
            payloadFormData.append('start_time', format(new Date(startDateTime), 'dd/MM/yyyy hh:mm'));

            const res = await createCandidate(payloadFormData);
            dispatch({ type: SET_NOTIFICATION, notification: generateNotification(res) });
        } catch (error) {
            dispatch({ type: SET_NOTIFICATION, notification: generateNotification(error) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form id="positionForm" noValidate onSubmit={handleSubmit(onSubmit)}>
            {loading ? <CircularLoader disabledBg /> : null}
            <Grid container spacing={gridSpacing} justifyContent="flex-start">
                <Grid item md={6} sm={12}>
                    <Stack spacing={2}>
                        <Typography variant="h3">Informasi Kandidat</Typography>
                        <Card>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack spacing={1}>
                                                <InputLabel>
                                                    <Typography variant="h4">Nama</Typography>
                                                </InputLabel>
                                                <TextField
                                                    {...field}
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    placeholder="John Doe"
                                                    error={errors.name !== undefined}
                                                    helperText={errors.name?.message}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack spacing={1}>
                                                <InputLabel>
                                                    <Typography variant="h4">Email</Typography>
                                                </InputLabel>
                                                <TextField
                                                    {...field}
                                                    variant="outlined"
                                                    margin="normal"
                                                    placeholder="johndoe@email.com"
                                                    required
                                                    fullWidth
                                                    error={errors.email !== undefined}
                                                    helperText={errors.email?.message}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <Typography variant="h4">Posisi</Typography>
                                        <FormControl fullWidth error={errors.position !== undefined}>
                                            <Controller
                                                name="position"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Autocomplete
                                                        isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                                        value={value || null}
                                                        options={positionList}
                                                        getOptionLabel={(option) => option.title}
                                                        disablePortal
                                                        renderInput={(params) => (
                                                            <TextField {...params} fullWidth placeholder="Software Engineer I" />
                                                        )}
                                                        onChange={(_, value) => {
                                                            onChange(value);
                                                            return value;
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.position && errors.position.message && (
                                                <FormHelperText>{errors.position?.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Stack>
                                </Grid>
                                {/* <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <Typography variant="h4">CV</Typography>
                                        <FormControl fullWidth error={errors.cv !== undefined}>
                                            <Controller
                                                name="cv"
                                                control={control}
                                                render={({ field }) => <FileUploader otherProps={{ ...field }} />}
                                            />
                                            {errors.cv && errors.cv?.message && <FormHelperText error>{errors.cv?.message}</FormHelperText>}
                                        </FormControl>
                                    </Stack>
                                </Grid> */}
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <Typography variant="h4">CV</Typography>
                                        <FormControl fullWidth>
                                            <FileUploader file={cv} setFile={setCv} />
                                        </FormControl>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Card>
                    </Stack>
                </Grid>
                <Grid item md={6} sm={12}>
                    <Stack spacing={2}>
                        <Typography variant="h3">Pengaturan Interview</Typography>
                        <Card>
                            <Grid container spacing={gridSpacing} justifyContent="flex-end">
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <Typography variant="h4">PIC</Typography>
                                        <FormControl fullWidth error={errors.pic !== undefined}>
                                            <Controller
                                                name="pic"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Autocomplete
                                                        isOptionEqualToValue={(opt, val) => opt.email === val.email}
                                                        value={value || null}
                                                        options={userList}
                                                        getOptionLabel={(option) => option.name}
                                                        disablePortal
                                                        renderInput={(params) => (
                                                            <TextField {...params} fullWidth placeholder="Nama PIC/Interviewer" />
                                                        )}
                                                        onChange={(_, value) => {
                                                            onChange(value);
                                                            return value;
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.pic && errors.position.pic && <FormHelperText>{errors.position?.pic}</FormHelperText>}
                                        </FormControl>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="expiredDuration"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack spacing={1}>
                                                <InputLabel sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography variant="h4">Durasi submisi</Typography>
                                                    <Tooltip title="Durasi submisi sebelum interview kedaluwarsa berlaku untuk setiap tahapan interview untuk posisi ini">
                                                        <IconButton sx={{ marginLeft: 1 }}>
                                                            <IconInfoCircle size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </InputLabel>
                                                <TextField
                                                    {...field}
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    placeholder="3"
                                                    type="number"
                                                    error={errors.expiredDuration !== undefined}
                                                    helperText={errors.expiredDuration?.message}
                                                    InputProps={{ endAdornment: <InputAdornment position="end">hari</InputAdornment> }}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <Typography variant="h4">Berlaku dari</Typography>
                                        <FormControl fullWidth error={errors.startDateTime !== undefined}>
                                            <Controller
                                                name="startDateTime"
                                                control={control}
                                                render={({ field: { value, onChange } }) => (
                                                    <Stack spacing={1}>
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <DateTimePicker
                                                                value={value}
                                                                onChange={(value) => {
                                                                    console.log(value);
                                                                    onChange(value);
                                                                }}
                                                            />
                                                        </LocalizationProvider>
                                                    </Stack>
                                                )}
                                            />
                                            {errors.startDateTime && errors.startDateTime.message && (
                                                <FormHelperText>{errors.startDateTime?.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Card>
                    </Stack>
                </Grid>
                <Grid item xs={3}>
                    <Button size="large" fullWidth variant="contained" type="submit">
                        Simpan
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default FormCandidatePage;
