var __find = require('lodash/collection/find');

function getTableRowForTeam(table, teamId) {
    return !!teamId ? __find(table, (r) => r.teamId === teamId) : {};
}

function populateFromTable(team1Id, team2Id, team1Stats, team2Stats, tableProp) {
    var prop = {};
    var team1Val = !!team1Id ? getTableRowForTeam(team1Stats.tables.table, team1Id)[tableProp] : null;
    var team2Val = !!team2Id ? getTableRowForTeam(team2Stats.tables.table, team2Id)[tableProp] : null;
    prop.team1 = {
        min: team1Val || filters[f].team1.min,
        max: team1Val || filters[f].team1.max
    }
    prop.team2 = {
        min: team2Val || filters[f].team2.min,
        max: team2Val || filters[f].team2.max
    }
    return prop;
}

module.exports = {
    toArray: function(filterStore){
        var filters = filterStore.get('filters');
        return Object.keys(filters).map((key) => filters[key]);
    },
    active: function (filterStore) {
        var filters = filterStore.get('filters');
        return Object.keys(filters).map((key) => filters[key]).filter((f) => f.active);
    },
    visible: function (filterStore) {
        var filters = filterStore.get('filters');
        return Object.keys(filters).map((key) => filters[key]).filter((f) => f.visible);
    },
    isVisible: function (filterStore, filterName) {
        var filter = filterStore.get('filters')[filterName];
        return !!filter && filter.visible;
    },
    getLastOrder: function (filterStore) {
        var max = 0;
        var filters = filterStore.constructor === Array ? filterStore : this.toArray(filterStore);
        filters.forEach((f) => (max = Math.max(f.order, max)));
        return max;
    },
    getLastVisibleOrder: function(filterStore){
        var max = 0;
        var filters = filterStore.constructor === Array ? filterStore : this.toArray(filterStore);
        filters.filter((f) => f.visible).forEach((f) => (max = Math.max(f.order, max)));
        return max;
    },
    get: function (filterStore, filterName) {
        return filterStore.get('filters')[filterName];
    },
    canMoveUp: function (filterStore, filterName) {
        var filter = this.get(filterStore, filterName);
        return !!filter && filter.order > 1;
    },
    canMoveDown: function (filterStore, filterName) {
        var filters = this.toArray(filterStore).filter((f) => f.visible),
        max = 0,
        filter = this.get(filterStore, filterName);

        filters.forEach((f) => (max = Math.max(max, f.order)));        
        return !!filter && filter.order < max;
    },
    changeOrder: function (filterStore, filterName, newOrder) {
        var filters = this.toArray(filterStore),
            current = this.get(filterStore, filterName),
            affected = __find(filters, (f) => f.order === newOrder);

        affected.order = current.order;
        current.order = newOrder;
    },
    order: function(filterStore){
        var filters = this.toArray(filterStore),
            visible = filters.filter((f) => f.visible).sort((a,b) => a.order - b.order),
            invisible = filters.filter((f) => !f.visible).sort((a,b) => a.order - b.order),
            i = 0;
        for (i = 0; i < visible.length; i++) {
            visible[i].order = i + 1;
        }
        for (var q = 0; q < invisible.length; q++) {
            invisible[q].order = i + 1 + q;
        }
    },
    moveToLast: function (filterStore, filterName) {
        var filters = this.toArray(filterStore),
        current = this.get(filterStore, filterName),
        affected = filters.filter((f) => f.order > current.order);
        affected.forEach((a) => a.order -= 1);
        current.order = filters.length;
    },
    populate: function (filterStore, teamStatStore) {
        var filters = filterStore.get('filters'),
            team1 = teamStatStore.get('selected').team1,
            team2 = teamStatStore.get('selected').team2,
            team1Stats = teamStatStore.get('team1'),
            team2Stats = teamStatStore.get('team2'),
            populated = {};
        for (var f in filters) {
            if (filters[f].visible) {
                populated[f] = {
                    team1: null,
                    team2: null
                }
                switch (f) {
                    case 'winsFilter': populated[f] = populateFromTable(team1, team2, team1Stats, team2Stats, 'wins'); break;
                    case 'pointsFilter': populated[f] = populateFromTable(team1, team2, team1Stats, team2Stats, 'points'); break;
                    case 'roundsFilter': populated[f] = populateFromTable(team1, team2, team1Stats, team2Stats, 'round'); break;
                    case 'pointsFilter': populated[f] = populateFromTable(team1, team2, team1Stats, team2Stats, 'points'); break;
                    case 'lossesFilter': populated[f] = populateFromTable(team1, team2, team1Stats, team2Stats, 'losses'); break;
                    case 'goalDiffFilter': populated[f] = populateFromTable(team1, team2, team1Stats, team2Stats, 'goalDiff'); break;
                    case 'goalsForFilter': populated[f] = populateFromTable(team1, team2, team1Stats, team2Stats, 'goalsFor'); break;
                    case 'goalsAgainstFilter': populated[f] = populateFromTable(team1, team2, team1Stats, team2Stats, 'goalsAgainst'); break;
                    case 'positionFilter': populated[f] = populateFromTable(team1, team2, team1Stats, team2Stats, 'position'); break;
                    case 'teamFilter': populated[f] = { team1: { teamId: team1 }, team2: {teamId: team2}}; break;
                    default:

                }
            }
        }
        return populated;
    }
}