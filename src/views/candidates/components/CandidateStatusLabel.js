import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { INTERVIEW_RESULT, INTERVIEW_STATUS } from 'configs/constant';
import { Chip } from '@mui/material';

function CandidateStatusLabel({ label }) {
    const theme = useTheme();
    let bgColor = '';
    let color = '';

    switch (label) {
        case INTERVIEW_STATUS.EXPIRED:
            bgColor = theme.palette.status.bgExpired;
            color = theme.palette.status.expired;
            break;
        case INTERVIEW_RESULT.ONHOLD:
            bgColor = theme.palette.status.bgOnhold;
            color = theme.palette.status.onhold;
            break;
        case INTERVIEW_RESULT.REJECTED:
            bgColor = theme.palette.status.bgRejected;
            color = theme.palette.status.rejected;
            break;
        case INTERVIEW_RESULT.SELECTED:
            bgColor = theme.palette.status.bgSelected;
            color = theme.palette.status.selected;
            break;
        case INTERVIEW_STATUS.WAITING_SUBMISSION:
            bgColor = theme.palette.status.bgSent;
            color = theme.palette.status.sent;
            break;
        case INTERVIEW_STATUS.WAITING_REVIEW:
            bgColor = theme.palette.status.bgWaiting;
            color = theme.palette.status.waiting;
            break;
        default:
            bgColor = theme.palette.status.bgExpired;
            color = theme.palette.status.expired;
    }

    return (
        <Chip
            variant="contained"
            label={label.charAt(0).toUpperCase() + label.toLowerCase().slice(1)}
            sx={{ backgroundColor: bgColor, color: color, fontSize: '12px' }}
            size="small"
        />
    );
}

CandidateStatusLabel.propTypes = {
    label: PropTypes.string
};

export default CandidateStatusLabel;
