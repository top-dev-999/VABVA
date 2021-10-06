exports.SECRET_KEY = process.env.JWT_SECRET_KEY || ''
exports.HOST = process.env.HOST || 'http://localhost:3001'
exports.FRONTEND_HOST = process.env.FRONTEND_HOST || 'https://vabva.com'

exports.AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || ''
exports.AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || ''
exports.AWS_REGION = process.env.AWS_REGION || ''
exports.AWS_SES_SOURCE = process.env.AWS_SES_SOURCE || ''