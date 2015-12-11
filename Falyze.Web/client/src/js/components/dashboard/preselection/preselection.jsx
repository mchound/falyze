var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    Spinner = require('../../common/Spinner/Spinner.jsx'),
    Select = require('../../common/Select/Select.jsx'),
    Gallery = require('../../common/gallery/gallery.jsx'),

    CountryRepo = require('../../../repositories/dashbaord/countryRepo'),
    SeasonRepo = require('../../../repositories/dashbaord/seasonRepo'),
    LeagueRepo = require('../../../repositories/dashbaord/leagueRepo'),
    DashboardRepo = require('../../../repositories/dashbaord/dashboardRepo'),
    
    Actions = require('../../../actions/actions').dashboard;

function _sameAsRepo(country, leagues, seasons) {
    var repoCountry = DashboardRepo.model.country.get(),
        repoLeagues = DashboardRepo.model.leagues.get(),
        repoSeasons = DashboardRepo.model.seasons.get();
    if (!country || !leagues.length || !seasons.length) {
        return false;
    }
    if (!!repoCountry && repoCountry.id !== country.id) {
        return false;
    }
    if (!!repoLeagues.length) {
        if (repoLeagues.filter((rl) => !leagues.find((l) => l.id === rl.id)).length > 0) {
            return false;
        }
    }
    if (!!repoSeasons.length) {
        if (repoSeasons.filter((rs) => !seasons.find((s) => s.id === rs.id)).length > 0) {
            return false;
        }
    }
    return true;
}

module.exports = Lean.createComponent({
    displayName: 'PreSelection',
    repositories: [CountryRepo, SeasonRepo, LeagueRepo],
    getInitialState: function () {
        return {
            country: DashboardRepo.model.country.get(),
            leagues: DashboardRepo.model.leagues.get(),
            seasons: DashboardRepo.model.seasons.get()
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
        var leagues = !selected ? [] : selected.map((s) => this.state.repo.league.find((l) => l.id === s.value));
        this.setState({ leagues: leagues, seasons: [] });
    },
    onLeaguesConfirm: function () {
        this.repo.season.server.get('/byLeagues/?leagues=' + this.state.leagues.map((l) => l.id).join(';')).then(function () {
            if (this.props.layout === 'slider') {
                this.refs.gallery.goTo(2);
            }
        }.bind(this))
        this.forceUpdate();
    },
    onSeasonSelect: function (selected) {
        var seasons = !selected ? [] : selected.map((s) => this.state.repo.season.find((s2) => s2.id === s.value));
        this.setState({ seasons: seasons });
    },
    onSeasonsConfirm: function () {
        Actions.preselection.dispatch({
            country: this.state.country,
            leagues: this.state.leagues,
            seasons: this.state.seasons
        });
    },
    goTo: function (slide) {
        this.refs.gallery.goTo(slide);
    },
    controller: function (state, props) {
        return {
            view: this.props.layout,
            countries: state.repo.country.map((c) => ({ value: c.id, text: c.name, selected: !!state.country && state.country.id === c.id })),
            leagues: state.repo.league.filter((l) => !!state.country && l.countryId === state.country.id).map((l) => ({ sortBy: l.level, value: l.id, text: l.name, selected: !!state.leagues.find((l2) => l2.id === l.id) })),
            seasonsPending: this.repo.season.isPending(),
            seasons: state.repo.season.map((s) => ({ value: s.id, text: s.name, sortBy: -s.startYear, selected: state.seasons.find((s2) => s2.id === s.id) })),
            staticConfirmHidden: _sameAsRepo(state.country, state.leagues, state.seasons)
        };
    },
    slider: function (model, state, props, q) {
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
    },
    static: function (model, state, props, q) {
        return (
            <div>
                <div className="mb">
                    <Select items={model.countries} defaultText="Select country" onChange={this.onCountrySelect} />
                </div>
                <div className="mb">
                    <Select items={model.leagues} multiple={true} defaultText="Select leagues" onClose={this.onLeagueSelect} disabled={!state.country} />
                </div>
                <div className="mb">
                    <Select items={model.seasons} multiple={true} defaultText="Select seasons" showCount={true} entityPluralName="seasons" onChange={this.onSeasonSelect} disabled={!state.leagues.length} />
                </div>
                <div className={q.hide(model.staticConfirmHidden)}>
                    <button data-am-button="green" className="btn-continue" disabled={!state.country || !state.leagues.length || !state.seasons.length}><i className="icon-check"></i>Confirm</button>
                </div>
            </div>
        );
    }
})