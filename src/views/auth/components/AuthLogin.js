import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';

import * as yup from 'yup';

import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/extended/AnimateButton';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from 'utils/api/auth';
import { SET_CANDIDATE, SET_CURRENT_QUESTION, SET_NOTIFICATION, SET_USER } from 'store/actions';
import { useNavigate } from 'react-router';
import config from 'configs';
import { generateNotification } from 'utils/notification';
import { loginInterview } from 'utils/api/interview';

const AuthLogin = ({ isClient = false, ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();
    const nav = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(
            yup.object().shape({
                email: yup.string().email('Must be a valid email').max(255).required('Email is required'),
                password: yup.string().max(255).required('Password is required')
            })
        ),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = async ({ email, password }) => {
        if (scriptedRef.current) {
            // TODO - remove hardcoded payload
            if (!isClient) {
                await login({
                    email: email,
                    password: password
                })
                    .then((res) => {
                        if (res.status === 200) {
                            localStorage.setItem('token', res.data.access_token);
                            dispatch({ type: SET_USER, user: res.data });
                            nav(config.defaultPath);
                        }
                    })
                    .catch((error) => {
                        dispatch({ type: SET_NOTIFICATION, notification: generateNotification(error) });
                    });
            } else {
                await loginInterview({ token: password })
                    .then((res) => {
                        if (res.status === 200) {
                            dispatch({ type: SET_CANDIDATE, candidate: res.data });
                            dispatch({ type: SET_CURRENT_QUESTION, index: 0 });
                            nav(`/interview/${res.data.id}`, { replace: true });
                        }
                    })
                    .catch((error) => {
                        return dispatch({ type: SET_NOTIFICATION, notification: generateNotification(error) });
                    });
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth error={Boolean(errors.email)} sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-email-login">Alamat Email</InputLabel>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <OutlinedInput {...field} id="outlined-adornment-email-login" type="email" name="email" label="Alamat Email" />
                        )}
                    />
                    {errors.email && errors.email?.message && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                            {errors.email?.message}
                        </FormHelperText>
                    )}
                </FormControl>
                {isClient ? (
                    <FormControl fullWidth error={Boolean(errors.password)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-password-login">Token Interview</InputLabel>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <OutlinedInput
                                    {...field}
                                    id="outlined-adornment-password-login"
                                    type={'text'}
                                    name="password"
                                    label="Token Interview"
                                />
                            )}
                        />
                        {errors.password && errors.password?.message && (
                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                {errors.password?.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                ) : (
                    <FormControl fullWidth error={Boolean(errors.password)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <OutlinedInput
                                    {...field}
                                    id="outlined-adornment-password-login"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    label="Password"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                size="large"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            )}
                        />
                        {errors.password && errors.password?.message && (
                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                {errors.password?.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                )}
                {/* 
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                    <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                        Forgot Password?
                    </Typography>
                </Stack> */}
                <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                        <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
                            {isClient ? 'Mulai Interview' : 'Masuk'}
                        </Button>
                    </AnimateButton>
                </Box>
            </form>
        </>
    );
};
AuthLogin.propTypes = {
    isClient: PropTypes.bool
};

export default AuthLogin;
