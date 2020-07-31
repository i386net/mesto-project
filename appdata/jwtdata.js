const { JWT_DATA, NODE_ENV } = process.env;
module.exports = { key: NODE_ENV === 'production' ? JWT_DATA : 'secret-key' };
