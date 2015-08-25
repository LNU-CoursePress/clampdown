'use strict';

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip:    process.env.IP ||
    undefined,

    // Server port
    port:
        process.env.PORT || 8000,

    // MongoDB connection options
    mongo: {
        uri:    "mongodb://localhost/students"
    }
};