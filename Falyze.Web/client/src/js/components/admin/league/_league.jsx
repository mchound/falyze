var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    LeagueRepo = require('../../../repositories/admin/leagueRepo'),
    AdminRepo = require('../../../repositories/admin/adminRepo'),

    _clone = require('lodash/lang/clone'),

    ValInput = require('../../common/form/validationInput.jsx'),
    ValGroup = require('../../common/form/validationGroup.jsx'),
    EditPanel = require('../editPanel/editPanel.jsx'),
    Select = require('../../common/select/select.jsx'),

    MsgUtils = require('../utils/utils').messages;

module.exports = Lean.createComponent({
    repositories: [LeagueRepo, AdminRepo],
    getInitialState: function () {
        return {
            selected: null,
            isEditing: false,
            isAdding: false,
            error: null
        };
    },
    onEdit: function () {
        //this.refs.valggroup.reset();
        this.setState({ isEditing: true, error: null });
    },
    onAdd: function () {
        this.setState({ isAdding: true, error: null });
    },
    onSubmit: function (e) {
        e.preventDefault();
        if (!this.refs.valgroup.validate()) {
            return;
        }
        else if (this.state.isEditing) {
            this.onSubmitEdit();
        }
        else {
            this.onSubmitAdd();
        }
    },
    onDelete: function () {
        MsgUtils.add('league - deleting', 'Deleting league', 'update');
        this.repo.league.server.remove('/' + this.state.selected.id).then(this.onLeagueDeleted).error(this.onServerError);
    },
    onLeagueDeleted: function (resp) {
        MsgUtils.remove('league - deleting');
        MsgUtils.add('league - deleted', 'League deleted', null, 3000);
        this.setState({ selected: null, isEditing: false });
    },
    onSubmitAdd: function () {
        var league= { name: this.refs.valgroup.refs.inpName.get(), level: this.refs.valgroup.refs.inpLevel.get(), countryId: this.state.repo.admin.country.id };
        MsgUtils.add('league - adding', 'Saving league', 'add');
        this.repo.league.server.post(league).then(this.onLeagueAdded).error(this.onServerError);
    },
    onSubmitEdit: function () {
        var league = _clone(this.state.selected);
        league.name = this.refs.valgroup.refs.inpName.get();
        league.level = this.refs.valgroup.refs.inpLevel.get();
        MsgUtils.add('league - updating', 'Updating league', 'update');
        this.repo.league.server.put(league).then(this.onLeagueUpdated.bind(this, league)).error(this.onServerError);
    },
    onLeagueChange: function (selected) {
        var league = selected.length ? this.state.repo.league.find((l) => l.id === selected[0].value) : null;
        AdminRepo.model.league.set(league);
        this.setState({ selected: league });
    },
    onLeagueUpdated: function (league, resp) {
        MsgUtils.remove('league - updating');
        MsgUtils.add('league - updated', 'League updated', null, 3000);
        this.setState({ selected: league, isEditing: false, error: null });
    },
    onLeagueAdded: function (league) {
        MsgUtils.remove('league - adding');
        MsgUtils.add('league - added', 'League added', null, 3000);
        this.setState({ isAdding: false, error: null, selected: league });
    },
    onServerError: function (xhr) {
        this.setState({ error: JSON.parse(xhr.response) });
    },
    controller: function (state, props) {
        return {
            view: { noCountry: !state.repo.admin.country, empty: state.repo.league.length === 0 },
            selectItems: state.repo.league.map((l) => ({ value: l.id, text: l.name, sortBy: l.level, selected: !!state.selected && l.id === state.selected.id })),
            selected: !!state.selected ? state.repo.league.find((l) => l.id === state.selected.id) || {} : {}
        };
    },
    _layout: function (children, model, state, props, q) {
        return (
            <div data-am-league className="property">
                {children}
                <EditPanel visible={state.isEditing || state.isAdding}
                           title={state.isEditing ? 'Edit Country' : 'Add Country' }
                           onDelete={state.isEditing ? this.onDelete : null}
                           onClose={this.changeState.bind(this, {isEditing: false, isAdding: false})}
                           onSubmit={this.onSubmit} error={state.error}>
                    <ValGroup ref="valgroup">
                        <ValInput ref="inpName" label="Name" value={state.isEditing ? model.selected.name : null} cssClass="group mb" required={true} errorMessage="Name is required" />
                        <ValInput ref="inpLevel" label="Level" value={state.isEditing ? model.selected.level : null} cssClass="group mb" required={true} pattern={/^\d+$/g} errorMessage="Level must be a number" />
                    </ValGroup>
                </EditPanel>
            </div>
        );
    },
    noCountry: function () {
        return (
            <div className="inline-block align-center space">
                <p className="mb-S">No country selected</p>
            </div>
        );
    },
    empty: function (model, state, props, q) {
        return (
            <div className="inline-block align-center space">
                <p className="mb-S">No leagues for this country</p>
                <button data-am-button="inline link" className="" onClick={this.onAdd}><i className="icon-plus"></i>Add league</button>
            </div>
        );
    },
    index: function (model, state, props, q) {
        return (
            <div>
                <div className="clearfix">
                    <label className="left">League</label>
                    <button data-am-button="inline link icon" className="" onClick={this.onAdd}><i className="icon-plus"></i>Add league</button>
                </div>
                <div className="mb">
                    <Select items={model.selectItems} defaultText="Select league" multiple={false} onChange={this.onLeagueChange} />
                    {q.if(!!model.selected.id, (
                        <button data-am-button="icon" className="icon-lg" onClick={this.onEdit}><i className="icon-cog"></i></button>
                    ))}
                </div>
            </div>
        );
    }
})