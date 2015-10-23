var Lean = require('../lean/lean'),
    Actions = require('../actions/Actions');

module.exports = Lean.createServerStore({
    alias: 'match',
    settings: {
        controller: 'api/match/',
        key: 'id',
        getMethod: 'object'
    },
    initialize: function (store, ajax) {
        store.silent.add('count', null);
        store.silent.add('matches', []);
        this.actOn(Actions.Prerequisites.confirm);
    },
    onConfirm: function (store, payload) {
        store.fetch('count/' + payload.country + '/?leagueIds=' + payload.leagues.join(';') + '&seasonIds=' + payload.seasons.join(';'));
    }
});