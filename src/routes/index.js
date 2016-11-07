module.exports = {
  "/": require('./auth-route'),
  "/tenants": require('./tenant-route'),
  "/sys-users": require('./sys-user-route')
};