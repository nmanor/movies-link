const cookiesSettings = {
  cookieName: process.env.COOKIE_NAME,
  password: process.env.COOKIE_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export default cookiesSettings;
