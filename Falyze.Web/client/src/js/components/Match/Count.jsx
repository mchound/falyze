var React = require('react'),
    Lean = require('../../lean/lean'),

    MatchStore = require('../../stores/MatchStore'),

    Spinner = require('../common/Spinner/Spinner.jsx'),

    Actions = require('../../actions/Actions');

module.exports = Lean.createController({
    displayName: 'PrerequisiteConfirm',
    stores: [MatchStore],
    isLoading: function () {
        return this.store.match.status === 'pending';
    },
    action: function (state) {
        return {
            count: this.store.match.get().count === null ? 'No matches selected' : this.store.match.get().count + ' matches filtered'
        };
    },
    renderLoad: function () {
        return (
            <div>
                <Spinner />
                Counting matches...
            </div>
        );
    },
    view: function (model) {
        return (
            <div>
                <p>{model.count}</p>
            </div>
        );
    }
});