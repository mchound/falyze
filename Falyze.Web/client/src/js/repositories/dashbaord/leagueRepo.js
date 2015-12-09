var Lean = require('../../lean.v2/lean');

module.exports = Lean.createServerRepository({
    alias: 'league',
    settings: {
        endpoint: '/api/dashboard/league'
    },
    initialize: function () {
        this.server.get();
    }
});