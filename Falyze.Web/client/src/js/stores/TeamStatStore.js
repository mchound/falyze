var Lean = require('../lean/lean'),

    Actions = require('../actions/Actions');

module.exports = Lean.createServerStore({
    alias: 'teamStat',
    settings: {
        controller: 'api/stats/team/',
        getMethod: 'object'
    },
    initialize: function (store, ajax) {
        store.silent.add('team1', null);
        store.silent.add('team2', null);
        store.silent.add('vs', null);
        store.silent.add('selected', {team1: null, team2: null});
        this.actOn(Actions.TeamStat.update);
    },
    onUpdate: function (store, payload) {
        var currentSelected = store.get('selected');
        store.local.update('selected', {
            team1: payload.team1,
            team2: payload.team2
        });        
        if ((currentSelected.team1 === null && payload.team1 !== null) || (currentSelected.team2 === null && payload.team2 !== null)) {
            var urlSuffix = (payload.team1 || '-1') + '/' + (payload.team2 || '-1');
            store.fetch(urlSuffix);
        }
    }
});