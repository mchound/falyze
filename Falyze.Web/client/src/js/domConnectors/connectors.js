var FilterStore = require('../stores/FilterStore'),
    MatchStore = require('../stores/MatchStore'),
    TeamStore = require('../stores/TeamStore');

module.exports = {
    filter: {
        stores: [FilterStore, MatchStore],
        initialize: function(){
            this.onStoreUpdate();
        },
        onStoreUpdate: function () {
            var filter = this.dom.attr('data-filter');
            if (!this.storeData.match.count || !this.storeData.filter.filters[filter] || !this.storeData.filter.filters[filter].visible) {
                if (filter === 'teamFilter') {
                    var v = 0;
                }
                this.dom.hide();
            }
            else {
                this.dom.show();
            }

            if (!!this.storeData.filter.filters[filter]) {
                this.dom.style('order', this.storeData.filter.filters[filter].order);
            }
        }
    },
    filterViewState: {
        stores: [FilterStore],
        initialize: function () {
            this.onStoreUpdate();
        },
        onStoreUpdate: function () {
            var filter = this.dom.attr('data-filter');
            if (!this.storeData.filter.filters[filter] || !this.storeData.filter.filters[filter].maximized || !this.storeData.filter.filters[filter].visible) {
                this.dom.addClass('minimized');
            }
            else {
                this.dom.removeClass('minimized');
            }
        }
    },
    teamstat: {
        stores: [TeamStore],
        initialize: function () {
            this.onStoreUpdate();
        },
        onStoreUpdate: function () {
            if (!this.storeData.team && this.store.team.status === 'waiting') {
                this.dom.query('#message').show();
            }
            else {
                this.dom.query('#message').hide();
            }
        }
    }
};