var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    Spinner = require('../../common/Spinner/Spinner.jsx'),
    Select = require('../../common/Select/Select.jsx'),
    Gallery = require('../../common/gallery/gallery.jsx'),

    CountryRepo = require('../../../repositories/dashbaord/countryRepo'),
    SeasonRepo = require('../../../repositories/dashbaord/seasonRepo'),
    LeagueRepo = require('../../../repositories/dashbaord/leagueRepo'),
    
    Actions = require('../../../actions/actions').dashboard;

module.exports = Lean.createComponent({
    displayName: 'PreSelection',
    repositories: [CountryRepo, SeasonRepo, LeagueRepo],
    getInitialState: function () {
        return {
            country: null,
            leagues: [],
            seasons: []
        };
    },
    onCountrySelect: function (selected) {
        var country;
        if (!selected || !selected.length || (!!this.state.country && this.state.country.id === selected[0].value)) {
            country = null;
        }
        else {
            country = this.state.repo.country.find((c) => c.id === selected[0].value);
        }
        this.setState({ country: country, leagues: [], seasons: [] });
    },
    onLeagueSelect: function (selected) {
        if (!selected) {
            this.setState({ leagues: [], seasons: [] });
        }
        else {
            this.setState({ leagues: selected, seasons: [] });
        }
    },
    onLeaguesConfirm: function () {
        this.repo.season.server.get('/byLeagues/?leagues=' + this.state.leagues.map((l) => l.value).join(';')).then(function () {
            this.refs.gallery.goTo(2);
        }.bind(this))
        this.forceUpdate();
    },
    onSeasonSelect: function (selected) {
        if (!selected) {
            this.setState({ seasons: [] });
        }
        else {
            this.setState({ seasons: selected });
        }
    },
    onSeasonsConfirm: function () {
        var leagueIds = this.state.leagues.map((l) => l.value),
            seasonIds = this.state.seasons.map((s) => s.value);

        Actions.preselection.dispatch({
            country: this.state.country,
            leagues: this.state.leagues.map((l) => this.state.repo.league.find((l2) => l.value === l2.id)),
            seasons: this.state.seasons.map((s) => this.state.repo.season.find((s2) => s.value === s2.id))
        });
    },
    goTo: function (slide) {
        this.refs.gallery.goTo(slide);
    },
    controller: function (state, props) {
        return {
            countries: state.repo.country.map((c) => ({ value: c.id, text: c.name, selected: !!state.country && state.country.id === c.id })),
            leagues: state.repo.league.filter((l) => !!state.country && l.countryId === state.country.id).map((l) => ({ sortBy: l.level, value: l.id, text: l.name, selected: !!state.leagues.find((l2) => l2.value === l.id) })),
            seasonsPending: this.repo.season.isPending(),
            seasons: state.repo.season.map((s) => ({ value: s.id, text: s.name, sortBy: -s.startYear, selected: state.seasons.find((s2) => s2.value === s.id) }))
        };
    },
    index: function (model, state, props, q) {
        return (
            <div className="cell">
                <div className="content-wrapper">
                    <div data-am-shout="round" className="icon-header mb-XXL">
                        <i className="icon-sliders"></i>
                    </div>
                    <Gallery ref="gallery">
                        <div className="slide">
                            <p className="mb-XXL size-up">Set your prerequistes. Select the country, leagues and seasons to apply filters on.</p>
                            <div className="mb">
                                <Select items={model.countries} defaultText="Select country" onChange={this.onCountrySelect} fixedStyle={true} />
                            </div>
                            <button className="btn-continue" disabled={!state.country} onClick={this.goTo.bind(this, 1)} data-am-button="green stretch">Continue <i className="icon-right-open-big right"></i></button>
                        </div>

                        <div className="slide">
                            <p className="mb-XXL size-up">Select leagues</p>
                            {q.if(!model.seasonsPending, (
                                <div>
                                    <div className="mb">
                                        <Select items={model.leagues} multiple={true} defaultText="Select leagues" onClose={this.onLeagueSelect} fixedStyle={true} />
                                    </div>
                                    <div className="mb">
                                        <button className="btn-continue" disabled={!state.leagues.length} onClick={this.onLeaguesConfirm} data-am-button="green stretch">
                                            Continue <i className="icon-right-open-big right"></i>
                                        </button>
                                    </div>
                                    <button data-am-button="link" onClick={this.goTo.bind(this, 0)}><i className="icon-left-open-big"></i>Back to country selection</button>
                                </div>
                            ))}
                            {q.if(model.seasonsPending, (
                            <div>
                                <div className="mb">
                                    <Spinner />
                                </div>
                                <p>
                                    Loading seasons, please wait...
                                </p>
                            </div>

                            ))}
                        </div>

                        <div className="slide">
                            <p className="mb-XXL size-up">Select seasons</p>
                            <div>
                                <div className="mb">
                                    <Select items={model.seasons} multiple={true} defaultText="Select seasons" showCount={true} entityPluralName="seasons" onChange={this.onSeasonSelect} fixedStyle={true} />
                                </div>
                                <div className="mb">
                                    <button className="btn-continue" disabled={!state.seasons.length} onClick={this.onSeasonsConfirm} data-am-button="green stretch"><i className="icon-check"></i>Confirm</button>
                                </div>
                                <button data-am-button="link" onClick={this.goTo.bind(this, 1)}><i className="icon-left-open-big"></i>Back to league selection</button>
                            </div>
                        </div>
                    </Gallery>
                </div>
            </div>
        );
    }
})