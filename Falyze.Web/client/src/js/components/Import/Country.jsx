var React = require('react'),
    Lean = require('../../lean/lean'),
    Ajax = require('../../lean/store/ajax'),
    Actions = require('../../actions/Actions').Import;

module.exports = Lean.createController({
    getInitialState: function(){
        return {
            countryId: null,
            name: null,
            valid: true,
            pending: false,
            errorMsg: ''
        };
    },
    onSubmit: function(e){
        e.preventDefault();
        let countryName = this.refs.country.getDOMNode().value;
        if (!countryName || countryName === '') {
            this.setState({
                name: false,
                valid: false,
                countryId: null
            });
        }
        else{
            this.setState({ pending: true, name: countryName, valid: true, countryId: null });
            if (!!this.state.name && !this.state.pending && !this.state.countryId && countryName === this.state.name) {
                this.save(countryName);
            }
            else{
                this.checkServer(countryName);
            }
        }
    },
    checkServer: function(countryName){
        Ajax.get('/api/import/country/' + countryName, this.setCountry,
            function (xhr) {
                var msg = xhr.status === 404 ? 'No country found with that name' : JSON.parse(xhr.responseText).errorMessage;
                this.setState({ pending: false, msg: msg });
                Actions.setCountry.dispatch(null);
            }.bind(this)
        );
    },
    save: function(countryName){
        Ajax.post('/api/import/country/' + countryName, null, this.setCountry,
            function (xhr) {
                var msg = JSON.parse(xhr.responseText).errorMessage;
                this.setState({ pending: false, msg: msg });
            }.bind(this)
        );
    },
    setCountry: function(country){
        this.setState({ pending: false, countryId: country.id });
        Actions.setCountry.dispatch(country);
    },
    action: function (state, props) {

        var iconClass = '';
        if (!!state.pending) iconClass = 'input-note icon-arrows-ccw rotate';
        else if (!state.name || state.name === '') iconClass = 'hidden';
        else if (!!state.countryId) iconClass = 'green input-note icon-check';
        else iconClass = 'red input-note icon-cancel';

        return {
            iconClass: iconClass,
            inputClass: state.valid ? 'okable' : 'okable error',
            buttonDisabled: !!state.pending,
            buttonText: !!state.name && !state.pending && !state.countryId ? 'Save new' : 'Confirm',
            msg: state.msg
        };
    },
    view: function (model, state, props) {

        return (
            <div data-am-import-country>
                <form onSubmit={this.onSubmit} data-am-import-form>
                    <div className="group mb">
                        <label>Country</label>
                        <input type="text" ref="country" className={model.inputClass} />
                        <button data-am-button="green" type="submit" disabled={model.buttonDisabled}>{model.buttonText}</button>
                        <i className={model.iconClass}></i>
                    </div>
                    <p>{model.msg}</p>
                </form>
            </div>  
        );

    }
});