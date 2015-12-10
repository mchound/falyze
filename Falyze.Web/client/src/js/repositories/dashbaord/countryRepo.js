var Lean = require('../../lean.v2/lean');

module.exports = Lean.createServerRepository({
    alias: 'country',
    settings: {
        endpoint: '/api/dashboard/country'
    },
    initialize: function () {
        
    }
});