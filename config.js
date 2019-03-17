module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    URL: process.env.BASE_URL || '<Your base url>',
    MONGODB_URI: process.env.MONGODB_URI || '<Your mongoDB instance>',
    JWT_SECRET: process.env.JWT_SECRET || '<Your secret>'
}
