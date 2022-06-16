export const APIUtils = {
    formatSalt: (value) => {
        return Math.ceil(value * 10000) / 1000;
    }
}
