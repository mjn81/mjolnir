export const PORT = process.env.PORT || 3000;

export const SWAGGER_OPTS = {
  customSiteTitle: 'Mjolnir API - file upload',
  customfavIcon:
    (process.env.BASE_HREF + '/' || '/') +
    'favicon.ico?v=1',
};
