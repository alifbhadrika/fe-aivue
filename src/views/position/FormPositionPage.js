import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
    Button,
    Card,
    Grid,
    Stack,
    TextField,
    Typography,
    InputLabel,
    MenuItem,
    IconButton,
    FormHelperText,
    FormControl,
    Tooltip,
    Autocomplete,
    Box
} from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LEVEL_OPTIONS, gridSpacing } from 'configs/constant';
import { getInterviewKits } from 'utils/api/interview-kit';
import { IconInfoCircle } from '@tabler/icons';
import { defaultValues, positionSchema } from 'utils/schema/position';
import { createPosition, getPositionById, updatePositionById } from 'utils/api/position';
import { useDispatch } from 'react-redux';
import { SET_NOTIFICATION } from 'store/actions';
import { generateNotification } from 'utils/notification';
import CircularLoader from 'components/CircularLoader';

function FormPositionPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [currentData, setCurrentData] = useState(null);
    const [interviewKitList, setInterviewKitList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        handleSubmit,
        setValue,
        control,
        formState: { errors },
        watch
    } = useForm({
        resolver: yupResolver(positionSchema),
        defaultValues
    });

    const getPositionDetail = async (id) => {
        try {
            const { data } = await getPositionById(id);
            setCurrentData(data);
        } catch (error) {
            dispatch({ type: SET_NOTIFICATION, notification: generateNotification(error) });
        }
    };

    const getInterviewKitList = async () => {
        try {
            const { data } = await getInterviewKits();
            setInterviewKitList(data);
        } catch (error) {
            dispatch({ type: SET_NOTIFICATION, notification: generateNotification(error) });
        }
    };

    useEffect(() => {
        getInterviewKitList();

        if (id) {
            getPositionDetail(id);
        }
    }, [id]);

    useEffect(() => {
        if (currentData !== null) {
            setValue('title', currentData.title);
            setValue('level', currentData.level);
            setValue('desc', currentData.description);
            setValue('interviewKits', currentData.interview_kits);
        }
    }, [currentData, setValue]);

    const onSubmit = async ({ title, level, desc, interviewKits }) => {
        setLoading(true);
        try {
            const payload = {
                title,
                level,
                description: desc,
                interview_kit_ids: interviewKits?.map((kit) => kit.id)
            };

            let res;
            if (id) {
                res = await updatePositionById(id, payload);
            } else {
                res = await createPosition(payload);
            }
            dispatch({ type: SET_NOTIFICATION, notification: generateNotification(res) });
        } catch (error) {
            dispatch({ type: SET_NOTIFICATION, notification: generateNotification(error) });
        } finally {
            setLoading(false);
            navigate('/position');
        }
    };

    return (
        <form id="positionForm" noValidate onSubmit={handleSubmit(onSubmit)}>
            {loading ? <CircularLoader disabledBg /> : null}
            <Grid container spacing={gridSpacing} justifyContent="flex-start">
                <Grid item sm={10}>
                    <Stack spacing={2}>
                        <Typography variant="h3">Informasi Pekerjaan</Typography>
                        <Card>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <Controller
                                        name="title"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack spacing={1}>
                                                <InputLabel>
                                                    <Typography variant="h4">Nama posisi</Typography>
                                                </InputLabel>
                                                <TextField
                                                    {...field}
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    placeholder="Software Engineer"
                                                    error={errors.title !== undefined}
                                                    helperText={errors.title?.message}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="level"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack spacing={1}>
                                                <InputLabel>
                                                    <Typography variant="h4">Level</Typography>
                                                </InputLabel>
                                                <TextField
                                                    {...field}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    error={errors.level !== undefined}
                                                    select
                                                    helperText={errors.level?.message}
                                                >
                                                    {LEVEL_OPTIONS.map((option) => (
                                                        <MenuItem key={option} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Stack>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="desc"
                                        control={control}
                                        render={({ field }) => (
                                            <Stack spacing={1}>
                                                <InputLabel>
                                                    <Typography variant="h4">Deskripsi</Typography>
                                                </InputLabel>
                                                <TextField
                                                    {...field}
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    placeholder="Deskripsi"
                                                    multiline
                                                    minRows={3}
                                                    error={errors.desc !== undefined}
                                                    helperText={errors.desc?.message}
                                                />
                                            </Stack>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="h4">Tahapan Interview</Typography>
                                            <Tooltip title="Interview kit pertama yang dipilih akan menjadi tahap pertama dan seterusnya">
                                                <IconButton sx={{ marginLeft: 1 }}>
                                                    <IconInfoCircle size={16} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>

                                        <FormControl fullWidth error={errors.interviewKits !== undefined}>
                                            <Controller
                                                name="interviewKits"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Autocomplete
                                                        isOptionEqualToValue={(option, value) => option.title === value.title}
                                                        value={value}
                                                        multiple
                                                        options={interviewKitList}
                                                        getOptionLabel={(option) => option.title}
                                                        filterSelectedOptions
                                                        renderInput={(params) => <TextField {...params} fullWidth placeholder="Tahapan" />}
                                                        onChange={(_, value) => {
                                                            onChange(value);
                                                            return value;
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.interviewKits && errors.interviewKits.message && (
                                                <FormHelperText>{errors.interviewKits?.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Stack>
                                    <Box my={2}>
                                        {watch &&
                                            watch('interviewKits')?.length > 0 &&
                                            watch('interviewKits')?.map((tahap, i) => (
                                                <Typography key={tahap.id} sx={{ marginBottom: 2 }} variant="h5">{`Tahap ${i + 1}: ${
                                                    tahap.title
                                                }`}</Typography>
                                            ))}
                                    </Box>
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

export default FormPositionPage;
