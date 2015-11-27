var Lean = require('../../lean.v2/lean'),
    AdminRepo = require('./adminRepo');

module.exports = Lean.createServerRepository({
    alias: 'alias',
    settings: {
        endpoint: '/api/admin/alias'
    },
    initialize: function () {
        this.subscribeTo(AdminRepo.model.team, this.onSelectTeam);
    },
    onSelectTeam: function (team) {
        if (!team) {
            this.model.set({});
        }
        else {
            this.server.get('/' + team.id);
        }
    }
});