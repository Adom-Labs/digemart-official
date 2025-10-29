export const getDOmain = () => {
    return process.env.NODE_ENV === 'production' ? 'https://digemart.com' : 'http://digemart.test:3000';
}