const authMethod = {
  login: 'auth/local/',
};

const usersMethod = {
  getUsers: 'clients',
  getTrainers: 'trainers',
};

export const host = {
  auth: {
    methods: authMethod,
  },
  users: {
    methods: usersMethod,
  },
};
