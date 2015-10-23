var Lean = require('../lean/lean'),
    Actions = require('../actions/Actions');

module.exports = Lean.createServerStore({
    alias: 'team',
    settings: {
        controller: 'api/team/',
        key: 'id'
    },
    initialize: function (store, ajax) {
        this.actOn(Actions.Prerequisites.confirm);
    },
    onConfirm: function (store, payload) {
        store.silent.clear();
        store.fetch(payload.country + '/?leagueIds=' + payload.leagues.join(';') + '&seasonIds=' + payload.seasons.join(';'));
    }
});