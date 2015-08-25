'use strict';

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        uri: "mongodb://localhost/devstudent"
    },
    seedDB: true,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        APIReadKey: "/QbDMw/2413dQ1FzraHwsFipdbmTMGMcBLWGg2o+",
        APIWriteKey: "SoS8P4O+EguOqib8zXmpQ0XjZfDMlVq1kOgOaNmB"
    }
};