const authMethod = {
  login: 'auth/local/',
};

const usersMethod = {
  getUsers: 'clients',
  getTrainers: 'trainers',
  getByTrainer: 'trainer',
};

const paymentsMethod = {
  paymentRecords: 'payment-records/',
  lastThreePayments: 'last-three-payments',
};

const measurementMethod = {
  measurements: 'measurements',
  lastThreeMeasurements: 'last-three-measurements',
};

const trainerSummary = {
  clientsCounts: 'summary-count/',
  allClientsCounts: 'all-summary-count/',
  clientsAccounts: 'summary-accounts/',
  allClientsAccounts: 'all-summary-accounts/',
  clientsSummary: 'trainer-summary/',
};

const adminMethods = {
  clientGeneralSummary: 'all-summary/',
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
  trainer: {
    methods: trainerSummary,
  },
  admin: {
    methods: adminMethods,
  },
};
