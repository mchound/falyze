var Lean = require('../lean/lean'),
    Actions = require('../actions/Actions'),
    
    Utils = require('../utils/Utils'),

    __assign = require('lodash/object/assign');

function getOrCreateFilter(filters, name) {
    var currentFilter = filters[name];
    if (!currentFilter) {
        currentFilter = {
            team1: {},
            team2: {},
            visible: true,
            active: true,
            maximized: true,
            order: Utils.Filter.getLastVisibleOrder(FilterStore) + 1
        };
        filters[name] = currentFilter;
    }
    return currentFilter;
}

var FilterStore = Lean.createStore({
    alias: 'filter',
    initialize: function (store) {
        store.silent.add('filters', { });
        this.actOn(Actions.Filter.update);
        this.actOn(Actions.Filter.updateTeam);
        this.actOn(Actions.Filter.updateManyTeam);
    },
    onUpdate: function (store, payload) {
        var current = store.get('filters');
        var currentFilter = getOrCreateFilter(current, payload.name);
        if (!!payload.configuration && payload.configuration.order !== undefined) {
            Utils.Filter.changeOrder(FilterStore, payload.name, payload.configuration.order);
        }
        if (!!payload.configuration && !payload.configuration.visible && payload.configuration.visible !== undefined) {
            Utils.Filter.moveToLast(FilterStore, payload.name);
        }
        currentFilter = __assign(currentFilter, payload.configuration);
        Utils.Filter.order(FilterStore);
        store.update('filters', current);
    },
    onUpdateTeam: function (store, payload) {
        var current = store.get('filters');
        var currentFilter = getOrCreateFilter(current, payload.filter.name);
        currentFilter[payload.team] = __assign(currentFilter[payload.team], payload.filter.configuration);
        store.update('filters', current);
    },
    onUpdateManyTeam: function (store, payload) {
        var current = store.get('filters');
        for (var filter in payload) {
            current[filter].team1 = payload[filter].team1;
            current[filter].team2 = payload[filter].team2;
        }
        store.update('filters', current);
    }
});

module.exports = FilterStore;