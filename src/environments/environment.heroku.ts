export const environment = {
  production: true,
  serverUrl: 'https://bolt-back.herokuapp.com/api/v1/',

  auth: {
    get: 'auth/saml',
  },

  types: {
    get: 'types',
  },

  login: {
    resource: '/oauth/token?_format=json',
  },

  logout: {
    resource: '/user/logout',
    get: 'auth/logout',
  },

  banners: {
    getAll: 'banners',
    post: 'banners',
    upload: 'banners/changestatus/',
    getById: 'banners/',
    putById: 'banners/',
    deleteById: 'banners/',
  },

  projects: {
    get: 'projects',
    getAll: 'projects/menu',
    menuByUser: 'projects/menubyuser',
    menuByRole: 'projects/menubyrole',
    post: 'projects',
    getById: 'projects/',
    putById: 'projects/',
    updateStatusById: 'projects/changestatus/',
    deleteById: 'projects/',
  },

  submenus: {
    get: 'submenus',
    post: 'submenus',
    getById: 'submenus/',
    putById: 'submenus/',
    deleteById: 'submenus/',
    updateStatusById: 'submenus/changestatus/',
  },

  apps: {
    get: 'apps',
    getAssoc: 'apps/assoc',
    post: 'apps',
    getById: 'apps/',
    putById: 'apps/',
    deleteById: 'apps/',
    updateStatusById: 'apps/changestatus/',
  },

  users: {
    getAll: 'user',
    getSaml: 'user/saml',
    getById: 'user/',
    post: 'user',
    putById: 'user/',
    deleteById: 'user/',
    updateStatusById: 'user/changestatus/',
  },
  roles: {
    getAll: 'roles',
    getById: 'roles/',
    post: 'roles',
    postWithProjects: 'projectRoles/createrolprojapps',
    putByIdWithProjects: 'projectRoles/updaterolprojapps/',
    putById: 'roles/',
    deleteById: 'roles/',
    updateStatusById: 'roles/changestatus/',
  },
  userRoles: {
    setRole: 'user-role/',
  },
  favorites: {
    getAll: 'favorites',
    getUserById: 'favorites/user/',
    post: 'favorites',
    putById: 'favorites/',
    deleteById: 'favorites/',
  },
};
