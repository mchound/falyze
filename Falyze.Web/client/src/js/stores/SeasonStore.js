var Lean = require('../lean/lean');

module.exports = Lean.createServerStore({
    alias: 'season',
    settings: {
        controller: 'api/Season/',
        key: 'id'
    },
    initialize: function (store, ajax) {
        ajax.get('');
    }
});