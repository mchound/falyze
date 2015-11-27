var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    CountryRepo = require('../../../repositories/admin/countryRepo'),
    AdminRepo = require('../../../repositories/admin/adminRepo'),

    _clone = require('lodash/lang/clone'),

    ValInput = require('../../common/form/validationInput.jsx'),
    EditPanel = require('../editPanel/editPanel.jsx'),
    Select = require('../../common/select/select.jsx'),

    MsgUtils = require('../utils/utils').messages;

module.exports = Lean.createComponent({
    repositories: [CountryRepo],
    getInitialState: function () {
        return {
            selected: null,
            isEditing: false,
            isAdding: false,
            error: null
        };
    },
    onCountryChange: function (selected) {
        var country = selected.length ? this.state.repo.country.find((c) => c.id === selected[0].value) : null;
        this.setState({ selected: country });
        AdminRepo.model.country.set(country);
    },
    onEdit: function () {
        //this.refs.inpName.reset();
        this.setState({ isEditing: true, error: null });
    },
    onAdd: function(){
        this.setState({ isAdding: true, error: null });
    },
    onDelete: function () {
        MsgUtils.add('country - deleting', 'Deleting country', 'update');
        this.repo.country.server.remove('/' + this.state.selected.id).then(this.onCountryDeleted).error(this.onServerError);
    },
    onCountryDeleted: function(resp){
        MsgUtils.remove('country - deleting');
        MsgUtils.add('country - deleted', 'Country deleted', null, 3000);
        this.setState({ selected: null, isEditing: false });
    },
    onCountryUpdated: function (country, resp) {
        MsgUtils.remove('country - updating');
        MsgUtils.add('country - updated', 'Country updated', null, 3000);
        this.setState({ selected: country, isEditing: false, error: null });
    },
    onCountryAdded: function(country){
        MsgUtils.remove('country - adding');
        MsgUtils.add('country - added', 'Country added', null, 3000);
        this.setState({ isAdding: false, error: null, selected: country });
    },
    onServerError: function(xhr){
        this.setState({ error: JSON.parse(xhr.response) });
    },
    onSubmit: function(e){
        e.preventDefault();
        if(!this.refs.inpName.validate()){
            return;
        }
        else if (this.state.isEditing) {
            this.onSubmitEdit();
        }
        else {
            this.onSubmitAdd();
        }
    },
    onSubmitAdd: function(){
        var country = { name: this.refs.inpName.get() };
        MsgUtils.add('country - adding', 'Saving country', 'add');
        this.repo.country.server.post(country).then(this.onCountryAdded).error(this.onServerError);
    },
    onSubmitEdit: function(){
        if (this.refs.inpName.get().toLowerCase() !== this.state.selected.name.toLowerCase()) {
            var country = _clone(this.state.selected);
            country.name = this.refs.inpName.get();
            MsgUtils.add('country - updating', 'Updating country', 'update');
            this.repo.country.server.put(country).then(this.onCountryUpdated.bind(this, country)).error(this.onServerError);
        }
    },
    shouldRender: function (state) {
        return !!state.repo.country && state.repo.country.length > 0;
    },
    controller: function (state) {
        return {
            selectItems: state.repo.country.map((c) => ({ value: c.id, text: c.name, selected: !!state.selected && c.id === state.selected.id})),
            selected: !!state.selected ? state.repo.country.find((c) => c.id === state.selected.id) || {} : {}
        };
    },
    index: function (model, state, props, q) {
        return (
            <div data-am-country className="property">
                <div className="clearfix">
                    <label className="left">Country</label>
                    <button data-am-button="inline link icon" className="" onClick={this.onAdd}><i className="icon-plus"></i>Add country</button>
                </div>
                <div className="mb">
                    <Select items={model.selectItems} defaultText="Select country" multiple={false} onChange={this.onCountryChange} />
                    {q.if(!!model.selected.id, (
                        <button data-am-button="icon" className="icon-lg" onClick={this.onEdit}><i className="icon-cog"></i></button>
                    ))}
                </div>
                <EditPanel 
                    visible={state.isEditing || state.isAdding} 
                    title={state.isEditing ? 'Edit Country' : 'Add Country'}
                    onDelete={state.isEditing ? this.onDelete : null} 
                    onClose={this.changeState.bind(this, {isEditing: false, isAdding: false})} 
                    onSubmit={this.onSubmit} error={state.error}>
                        <ValInput ref="inpName" label="Name" value={state.isEditing ? model.selected.name : null} cssClass="group mb" required={true} />
                </EditPanel>
            </div>
        );
    }
});