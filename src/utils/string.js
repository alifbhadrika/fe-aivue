export const capitalizeFirstChar = (s) => {
    if (!s) {
        return;
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const containsNumbers = (str) => {
    return /\d/.test(str);
};

export const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
};

export const stringAvatar = (name) => {
    let nameUpper = name.toUpperCase();
    return {
        sx: {
            bgcolor: stringToColor(name)
        },
        children: nameUpper[0]
    };
};
