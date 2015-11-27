var React = require('react'),
    Lean = require('../../lean/lean'),

    Actions = require('../../actions/Actions'),

    ImportStore = require('../../stores/import/ImportStore');

module.exports = Lean.createController({
    stores: [ImportStore],
    onNoteClick: function(index){
        Actions.Import.removeServerNote.dispatch(index);
    },
    onErrorClick: function (index) {
        Actions.Import.removeServerError.dispatch(index);
    },
    shouldRender: function (state) {
        return state.store.import.server.status !== '' || state.store.import.server.errors.length > 0 || state.store.import.server.notes.length > 0;
    },
    action: function (state, props) {
        return {
            status: state.store.import.server.status,
            errors: state.store.import.server.errors,
            notes: state.store.import.server.notes
        };
    },
    view: function (model, state, props, q) {
        return (
            <div data-am-importstatus>
                <div className={!!model.status && model.status !== '' ? 'status' : 'hidden'}>
                    <i className="icon-arrows-ccw rotate"></i>{model.status}
                </div>
                <ul className={model.notes.length === 0 ? 'hidden' : 'notes'}>
                    {model.notes.map((e, i) => {return (
                        <li key={i} onClick={this.onNoteClick.bind(this, i)}>{e}</li>
                    )})}
                </ul>
                <ul className={model.errors.length === 0 ? 'hidden' : 'errors' }>
                    {model.errors.map((e, i) => {return (
                        <li key={i} onClick={this.onErrorClick.bind(this, i)}>{e}</li>
                    )})}
                </ul>
            </div>  
        );
    }
});