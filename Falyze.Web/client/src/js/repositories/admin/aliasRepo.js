var Lean = require('../../lean.v2/lean'),
    AdminRepo = require('./adminRepo');

module.exports = Lean.createServerRepository({
    alias: 'alias',
    settings: {
        endpoint: '/api/admin/alias'
    },
    initialize: function () {
        this.subscribeTo(AdminRepo.model.country, this.onSelectCountry);
    },
    onSelectCountry: function (country) {
        if (!country) {
            this.model.set({});
        }
        else {
            this.server.get('/byCountry/' + country.id);
        }
    }
});