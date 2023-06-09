import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Chip, ClickAwayListener, List, ListItemButton, ListItemIcon, ListItemText, Popper, Typography } from '@mui/material';

import { IconLogout, IconSettings } from '@tabler/icons';
import Transitions from 'components/extended/Transitions';
import MainCard from 'components/cards/MainCard';
import { stringAvatar } from 'utils/string';

const ProfileSection = ({ logoutHandler }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const user = useSelector((state) => state.global.user);

    const [open, setOpen] = useState(false);

    const anchorRef = useRef(null);
    const handleLogout = async () => {
        await logoutHandler();
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.background.default,
                    backgroundColor: theme.palette.background.default,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                        {...stringAvatar(user.name)}
                    />
                }
                label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
                sx={{
                    zIndex: 999
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                <Box>
                                    <List
                                        component="nav"
                                        sx={{
                                            width: '100%',
                                            maxWidth: 350,
                                            minWidth: 300,
                                            backgroundColor: theme.palette.background.paper,
                                            borderRadius: '10px',
                                            [theme.breakpoints.down('md')]: {
                                                minWidth: '100%'
                                            },
                                            '& .MuiListItemButton-root': {
                                                mt: 0.5
                                            }
                                        }}
                                    >
                                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px` }} onClick={handleLogout}>
                                            <ListItemIcon>
                                                <IconLogout stroke={1.5} size="1.3rem" />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                        </ListItemButton>
                                    </List>
                                </Box>
                            </MainCard>
                        </ClickAwayListener>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

ProfileSection.propTypes = {
    logoutHandler: PropTypes.func
};

export default ProfileSection;
