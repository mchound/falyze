var React = require('react'),
    Lean = require('../../lean/lean'),
    
    Utils = require('../../Utils/Utils'),

    MatchStore = require('../../stores/MatchStore'),
    FilterStore = require('../../stores/FilterStore');

module.exports = Lean.createController({
    stores: [MatchStore, FilterStore],
    shouldRender: function (state, props) {
        return true;
    },
    getRenderState: function(state, props){
        if(!state.store.match.count){
            return 'no-matches';
        }
        else if(!Utils.Filter.visible(FilterStore).length){
            return 'no-filters';
        }
        else{
            return 'button';
        }
    },
    view: {
        'no-matches': function(){
            return (
                <div>
                    <p className="large align-center">No matches selected. Select country, leagues and seasons.</p>
                </div>  
            );
        },
        'no-filters': function(){
            return (
                <div>
                    <p className="large align-center">No filters selected. Select your filters in the filter menu.</p>
                </div>  
            );
        },
        'button': function(){
            return (
                <div>
                    <button data-am-button="green cta stretch"><i className="icon-chart-line"></i>Show Stats<i className="icon-right-open-big icon-cta"></i></button>
                </div>
            );
        }
    }
});

