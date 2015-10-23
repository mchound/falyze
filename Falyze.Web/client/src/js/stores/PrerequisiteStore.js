var Lean = require('../lean/lean'),
    Actions = require('../actions/Actions');

module.exports = Lean.createStore({
    alias: 'prerequisite',
    initialize: function (store) {
        store.silent.add('country', null);
        store.silent.add('leagues', []);
        store.silent.add('seasons', []);

        setTimeout(function () {
            store.update('country', { value: 3 });
            store.update('leagues', [{ value: 7 }]);
            store.update('seasons', [{ value: 202 }, { value: 212 }]);
        }, 500);

        this.actOn(Actions.Prerequisites.changeCountry);
        this.actOn(Actions.Prerequisites.changeLeague);
        this.actOn(Actions.Prerequisites.changeSeason);
    },
    onChangeCountry: function (store, payload) {
        store.update('country', payload);
    },
    onChangeLeague: function (store, payload) {
        store.update('leagues', payload);
    },
    onChangeSeason: function (store, payload) {
        store.update('seasons', payload);
    }
});