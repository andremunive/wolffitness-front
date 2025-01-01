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
  lastThreePayments: 'last-three-payments',
};

const measurementMethod = {
  measurements: 'measurements',
  lastThreeMeasurements: 'last-three-measurements',
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
