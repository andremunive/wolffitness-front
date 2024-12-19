const authMethod = {
  login: 'auth/local/',
};

const usersMethod = {
  getUsers: 'clients',
  getTrainers: 'trainers',
  getByTrainer: 'trainer',
};

const paymentsMethod = {
  paymentRecords: 'payment-records',
};

const measurementMethod = {
  measurements: 'measurements',
};

export const host = {
  auth: {
    methods: authMethod,
  },
  users: {
    methods: usersMethod,
  },
  measurement: {
    methods: measurementMethod,
  },
  payment: {
    methods: paymentsMethod,
  },
};
