var Lean = require('../../lean.v2/lean'),
    Ajax = require('../../utils/ajax'),
    Actions = require('../../actions/actions').dashboard;

module.exports = Lean.createRepository({
    alias: 'dashboard',
    model: {
        country: Lean.observable(null),
        leagues: Lean.observable([]),
        seasons: Lean.observable([]),
        matchCount: Lean.observable(null),
        error: Lean.observable(null)
    },
    initialize: function () {
        this.reactOn(Actions.preselection);
    },
    onPreselection: function (payload) {
        var leagueIds = payload.leagues.map((l) => l.id),
            seasonIds = payload.seasons.map((s) => s.id);
        Ajax.get('/api/dashboard/match/count/?leagues=' + leagueIds.join(';') + '&seasons=' + seasonIds.join(';'),
            function (matchCount) {
                this.model.country.set(payload.country);
                this.model.leagues.set(payload.leagues);
                this.model.seasons.set(payload.seasons);
                this.model.matchCount.set(matchCount);
                console.log(matchCount);
            }.bind(this),
            function () {
                this.model.error.set('Something went wrong, please try again');
            }.bind(this)
        );
    }
});