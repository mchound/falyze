var __find = require('lodash/collection/find');

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
    }
}