'use strict';

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip:    process.env.IP ||
    undefined,

    // Server port
    port:
        process.env.PORT || 3000,

    // MongoDB connection options
    mongo: {
        uri:    "mongodb://localhost/students"
    },
    secrets: {
        APIReadKey:     process.env["APIReadKey"],
        APIWriteKey:    process.env["APIWriteKey"]
    }
};