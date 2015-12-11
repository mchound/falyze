var React = require('react'),
    Lean = require('../../../lean.v2/lean'),

    FilterItem = require('./filteritem.jsx');

module.exports = Lean.createComponent({
    displayName: 'FilterSekector',
    controller: function (state, props) {
        
    },
    index: function (model, state, props, q) {
        return (
            <div className="nav-section" data-am-filterlist>
                <header className="header"><i className="icon-filter"></i>Filters</header>
                <ul className="filters nav-items">
                    <FilterItem filter="position" label="Position" />
                    <FilterItem filter="points" label="Points" />
                    <FilterItem filter="goalsFor" label="Goals for" />
                    <FilterItem filter="goalsAgainst" label="Goals against" />
                    <FilterItem filter="goalDiff" label="Goals diff" />
                    <FilterItem filter="round" label="Round" />
                </ul>  
            </div>
        );
    }
});