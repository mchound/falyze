var Lean = require('../../lean.v2/lean');

module.exports = Lean.createServerRepository({
    alias: 'season',
    settings: {
        endpoint: '/api/dashboard/season'
    },
    initialize: function () {
    }
});