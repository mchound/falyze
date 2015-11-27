var Lean = require('../../lean/lean'),
    Actions = require('../../actions/Actions').Admin.Country;

module.exports = Lean.createServerStore({
    alias: 'admincountry',
    settings: {
        controller: 'api/admin/country',
        key: 'id'
    },
    initialize: function (store, ajax) {
        ajax.get('');
        this.actOn(Actions.update);
    },
    onUpdate: function (store, country) {
        store.update(country);
    }
});