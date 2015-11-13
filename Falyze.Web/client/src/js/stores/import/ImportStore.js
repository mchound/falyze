var Lean = require('../../lean/lean'),
    Actions = require('../../actions/Actions'),
    Ajax = require('../../lean/Store/ajax');

module.exports = Lean.createStore({
    alias: 'import',
    initialize: function (store) {
        store.silent.add('country', null);
        store.silent.add('leagues', []);
        store.silent.add('leagueId', null);
        store.silent.add('fetchingLeagues', false);
        store.silent.add('matches', []);
        store.silent.add('startYear', null);
        store.silent.add('teams', []);
        store.silent.add('aliases', []);

        this.actOn(Actions.Import.setCountry);
        this.actOn(Actions.Import.addLeague);
        this.actOn(Actions.Import.setLeague);
        this.actOn(Actions.Import.addMatches);
        this.actOn(Actions.Import.setStartYear);
        this.actOn(Actions.Import.addTeam);
        this.actOn(Actions.Import.renameTeam);
        this.actOn(Actions.Import.deleteTeam);
    },
    onSetCountry: function (store, payload) {
        store.update('country', payload);
        store.update('leagues', []);
        store.update('fetchingLeagues', true);
        if (!!payload) {

            // Get leagues
            Ajax.get('/api/import/league/' + payload.id,
                function (leagues) {
                    store.update('leagues', leagues);
                    store.update('fetchingLeagues', false);
                },
                function () {
                    store.update('fetchingLeagues', false);
                }
            );

            // Get teams
            Ajax.get('/api/import/team/' + payload.id,
                function (data) {
                    store.update('teams', data.teams);
                    store.update('aliases', data.aliases);
                },
                function () { console.log('Could not fetch teams when country was set. ', arguments); }
            );
        }
    },
    onAddLeague: function (store, payload) {
        var leagues = store.get('leagues');
        leagues.push(payload);
        store.update('leagues', leagues);
    },
    onSetLeague: function (store, payload) {
        store.update('leagueId', payload);
    },
    onAddMatches: function (store, payload) {
        store.update('matches', payload);
    },
    onSetStartYear: function (store, payload) {
        store.update('startYear', payload);
    },
    onAddTeam: function (store, payload) {
        var current = store.get('teams');
        current.push(payload);
        store.update('teams', current);
    },
    onRenameTeam: function (store, team) {
        var teams = store.get('teams'),
        old = teams.filter((t) => t.id === team.id)[0];
        old.name = team.name;
        store.update('teams', teams);
    },
    onDeleteTeam: function (store, teamId) {
        var teams = store.get('teams').filter((t) => t.id !== teamId);
        store.update('teams', teams);
    }
});