var Lean = require('../../lean.v2/lean');

module.exports = Lean.createServerRepository({
    alias: 'season',
    settings: {
        endpoint: '/api/admin/season'
    }
});