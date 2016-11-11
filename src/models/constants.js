module.exports = {
  tenant: {
    status: {
      active: 'active'
    },
    admin: {
      name: 'system-admin',
      type: 'admin',
      description: 'The system admin tenant. This is predefined by reits auth server.'
    },
    investor: {
      name: 'reits-investor',
      type: 'investor',
      description: 'The investors tenant. All users belong to this tenant are investors (portal user).'
    },
    types: {
      admin: {
        roles: ['admin', 'pm', 'fa', 'finance']
      },
      operator: {
        roles: ['admin', 'pm', 'fa', 'finance']
      },
      investor: {
        roles: ['investor']
      }
    }
  },
  user: {
    status: {
      deleted: 'deleted',
      enabled: 'enabled',
      disabled: 'disabled'
    }
  }
};