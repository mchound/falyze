var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    AdminRepo = require('../../../repositories/admin/adminRepo'),

    _clone = require('lodash/lang/clone'),
    _assign = require('lodash/object/assign'),

    ValInput = require('../../common/form/validationInput.jsx'),
    ValGroup = require('../../common/form/validationGroup.jsx'),
    EditPanel = require('../editPanel/editPanel.jsx'),
    Select = require('../../common/select/select.jsx'),

    MsgUtils = require('../utils/msgUtils').messages;

var base = {
    getInitialState: function () {
        return {
            selected: null,
            isEditing: false,
            isAdding: false,
            error: null,
            fetched: false
        };
    },
    onEdit: function () {
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
        MsgUtils.add(this.entityType + ' - deleting', 'Deleting ' + this.entityType, 'update');
        this.repo[this.entityType].server.remove('/' + this.state.selected.id).then(this.onEntityDeleted).error(this.onServerError);
    },
    onEntityDeleted: function (resp) {
        MsgUtils.remove(this.entityType + ' - deleting');
        MsgUtils.add(this.entityType + ' - deleted', this.entityType + ' deleted', null, 3000);
        this.setState({ selected: null, isEditing: false });
    },
    onSubmitAdd: function () {
        var entity = this.getEntity(this.refs.valgroup);
        MsgUtils.add(this.entityType + ' - adding', 'Saving ' + this.entityType, 'add');
        this.repo[this.entityType].server.post(entity).then(this.onEntityAdded).error(this.onServerError);
    },
    onSubmitEdit: function () {
        var league = this.updateEntity(this.state.selected, this.refs.valgroup);
        MsgUtils.add(this.entityType + ' - updating', 'Updating ' + this.entityType, 'update');
        this.repo[this.entityType].server.put(league).then(this.onEntityUpdated.bind(this, league)).error(this.onServerError);
    },
    onEntityChange: function (selected) {
        var entity = selected.length ? this.state.repo[this.entityType].find((e) => e.id === selected[0].value) : null;
        AdminRepo.model[this.entityType].set(entity);
        if (!!this.onEntityChangeOverride) {
            this.onEntityChangeOverride(entity);
        }
        this.setState({ selected: entity });
    },
    onEntityUpdated: function (entity, resp) {
        MsgUtils.remove(this.entityType + ' - updating');
        MsgUtils.add(this.entityType + ' - updated', this.entityType + ' updated', null, 3000);
        AdminRepo.model[this.entityType].set(entity);
        this.setState({ selected: entity, isEditing: false, error: null });
    },
    onEntityAdded: function (entity) {
        MsgUtils.remove(this.entityType + ' - adding');
        MsgUtils.add(this.entityType + ' - added', this.entityType + ' added', null, 3000);
        AdminRepo.model[this.entityType].set(entity);
        this.setState({ isAdding: false, error: null, selected: entity });
    },
    onServerError: function (xhr) {
        this.setState({ error: JSON.parse(xhr.response) });
    },
    defaultSortBy: function (entity) {
        if (!!this.sortBy) {
            return this.sortBy(entity);
        }
        return entity.name;
    },
    defaultGetSelectItems: function (state) {
        if (!!this.getSelectItems) {
            return this.getSelectItems(state);
        }
        return state.repo[this.entityType].map((e) => ({ value: e.id, text: e.name, sortBy: this.defaultSortBy(e), selected: !!state.selected && e.id === state.selected.id }))
    },
    isLoading: function(state){
        return !this.state.fetched;
    },
    renderLoad: function(){
        return (<p>Fetching from server, please wait...</p>);
    },
    controller: function (state, props) {
        return {
            view: this.getView(state, props),
            selectItems: this.defaultGetSelectItems(state),
            selected: !!state.selected ? state.repo[this.entityType].find((e) => e.id === state.selected.id) || {} : {},
            editPanelHeader: state.isEditing ? 'Edit ' + this.entityType : 'Add ' + this.entityType
        };
    },
    _layout: function (children, model, state, props, q) {
        return (
            <div data-am-league className="property">
                {children}
                <EditPanel visible={state.isEditing || state.isAdding}
                    title={model.editPanelHeader}
                    onDelete={state.isEditing ? this.onDelete : null}
                    onClose={this.changeState.bind(this, {isEditing: false, isAdding: false})}
                    onSubmit={this.onSubmit} error={state.error}>
                    <ValGroup ref="valgroup">
                        {this.getInputs(model, state, props, q)}
                    </ValGroup>
                </EditPanel>
            </div>
        );
    },
    index: function (model, state, props, q) {
        return (
            <div data-am-lague className="property">
                <div className="clearfix">
                    <label className="left">{this.header}</label>
                    <button data-am-button="inline link icon" className="" onClick={this.onAdd}><i className="icon-plus"></i>{'Add ' + this.entityType}</button>
                </div>
                <div className="mb">
                    <Select items={model.selectItems} defaultText={'Select ' + this.entityType} multiple={false} onChange={this.onEntityChange} />
                    {q.if(!!model.selected.id, (
                        <button data-am-button="icon" className="icon-lg" onClick={this.onEdit}><i className="icon-cog"></i></button>
                    ))}
                </div>
            </div>
        );
    }
};

module.exports = function (options) {
    var _base = _clone(base);
    _assign(_base, options);
    return Lean.createComponent(_base);
}