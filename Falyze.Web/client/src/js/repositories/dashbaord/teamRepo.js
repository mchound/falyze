var Lean = require('../../lean.v2/lean'),
    Ajax = require('../../utils/ajax'),
    Actions = require('../../actions/actions').dashboard;

module.exports = Lean.createServerRepository({
    alias: 'season',
    settings: {
        endpoint: '/api/dashboard/team'
    },
    initialize: function () {
        this.reactOn(Actions.preselection);
    },
    onPreselection: function (payload) {
        var leagueIds = payload.leagues.map((l) => l.id),
            seasonIds = payload.seasons.map((s) => s.id);
        this.server.get('/?leagues=' + leagueIds.join(';') + '&seasons=' + seasonIds.join(';'));
    }
});