var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    ValidationInput = require('../../common/form/validationInput.jsx'),
    ValidationGroup = require('../../common/form/validationGroup.jsx'),

    UploadRepo = require('../../../repositories/admin/uploadRepo');

module.exports = Lean.createComponent({
    displayName: 'AddMatch',
    onSubmit: function (e) {
        e.preventDefault();
        if (this.refs.group.validate()) {
            var match = {
                date: this.refs.group.refs.date.get(),
                homeTeam: this.refs.group.refs.homeTeam.get(),
                awayTeam: this.refs.group.refs.awayTeam.get(),
                result: this.refs.group.refs.result.get(),
                startYear: parseInt(this.refs.group.refs.startYear.get())
            };
            var matches = UploadRepo.getModel().matches;
            matches.push(match);
            UploadRepo.model.matches.set(matches);
        }
    },
    controller: function () {

    },
    index: function () {
        return (
            <form data-am-form onSubmit={this.onSubmit} style={{maxWidth: '200px'}}>
                <div className="mb">
                    <ValidationGroup ref="group">
                        <ValidationInput cssClass="mb" label="Date" ref="date" pattern={/\d{4}\-\d{2}\-\d{2}/} errorMessage="Wrong date format" required={true} />
                        <ValidationInput cssClass="mb" label="Season start year" ref="startYear" pattern={/\d{4}/} errorMessage="Wrong year format" required={true} />
                        <ValidationInput cssClass="mb" label="Home team" ref="homeTeam" errorMessage="This field is required" required={true} />
                        <ValidationInput cssClass="mb" label="Away team" ref="awayTeam" errorMessage="This field is required" required={true} />
                        <ValidationInput cssClass="mb" label="Result (x-y)" ref="result" errorMessage="Wrong format for result" pattern={/\d+\-\d+/} required={true} />
                    </ValidationGroup>
                </div>
                <button data-am-button="green" type="submit">Save</button>
            </form>   
        );
    }
})