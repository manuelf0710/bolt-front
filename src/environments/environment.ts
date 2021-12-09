// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // serverUrl: 'https://boltmaz.azurewebsites.net/api/v1/',
  serverUrl: 'http://192.168.0.107:3000/api/v1/',
  //serverUrl: 'https://bolt-back.herokuapp.com/api/v1/',

  auth: {
    get: 'auth/saml',
    registerlogout: 'auth/registerlog',
  },

  types: {
    get: 'types',
  },

  login: {
    resource: '/oauth/token?_format=json',
  },

  logout: {
    resource: '/user/logout',
    get: 'https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0',
  },

  request: {
    accesstoproject: 'mail',
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
    getAll: 'projects/menu/',
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
    postCreate: 'user/createuser',
  },
  roles: {
    getAll: 'roles',
    getById: 'roles/',
    post: 'roles',
    postWithProjects: 'projectRoles/createrolprojapps',
    putByIdWithProjects: 'projectRoles/updaterolprojapps/',
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
    deleteFromArray: 'favorites/arrayfav/',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
