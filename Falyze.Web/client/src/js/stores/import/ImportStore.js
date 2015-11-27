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
        store.silent.add('server', {status: '', notes: [], errors: []});

        this.actOn(Actions.Import.setCountry);
        this.actOn(Actions.Import.addLeague);
        this.actOn(Actions.Import.setLeague);
        this.actOn(Actions.Import.addMatches);
        this.actOn(Actions.Import.setStartYear);
        this.actOn(Actions.Import.addTeam);
        this.actOn(Actions.Import.addAlias);
        this.actOn(Actions.Import.renameTeam);
        this.actOn(Actions.Import.deleteTeam);
        this.actOn(Actions.Import.setServerStatus);
        this.actOn(Actions.Import.removeServerError);
        this.actOn(Actions.Import.removeServerNote);
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
                    if (leagues.length > 0) {
                        store.update('leagueId', leagues[0]);
                    }
                    store.update('fetchingLeagues', false);
                },
                function () {
                    store.update('fetchingLeagues', false);
                    store.update('leagueId', null);
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
    onAddAlias: function (store, payload) {
        var current = store.get('aliases');
        current.push(payload);
        store.update('aliases', current);
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
    },
    onSetServerStatus: function (store, payload) {
        var current = store.get('server'),
            status = payload.status !== undefined ? payload.status : '',
            errors = payload.errors !== undefined && payload.errors.constructor === Array ? current.errors.concat(payload.errors) : current.errors,
            notes = payload.notes !== undefined && payload.notes.constructor === Array ? current.notes.concat(payload.notes) : current.notes;
        current.status = status;
        current.errors = errors;
        current.notes = notes;
        store.update('server', current);
    },
    onRemoveServerError: function (store, payload) {
        var current = store.get('server');
        current.errors.splice(payload, 1);
        store.update('server', current);
    },
    onRemoveServerNote: function (store, payload) {
        var current = store.get('server');
        current.notes.splice(payload, 1);
        store.update('server', current);
    }
});