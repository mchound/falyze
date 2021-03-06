﻿var React = require('react'),

    _isNumber = require('lodash/lang/isNumber');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            min: this.props.defaultMin === undefined ? '' : this.props.defaultMin,
            max: this.props.defaultMax === undefined ? '' : this.props.defaultMax
        };
    },
    setStateAndNotify: function(state){
        var current = this.state;
        current.min = state.min === undefined ? current.min : state.min;
        current.max = state.max === undefined ? current.max : state.max;
        this.setState(current);
        if (!!this.props.onChange) {
            this.props.onChange(current);
        }
    },
    onChangeMin: function(){
        var sVal = this.refs.min.getDOMNode().value,
            iVal = Number(sVal);
        if (sVal !== '' && (!_isNumber(iVal) || isNaN(iVal))) {
            this.setState({ min: this.state.min });
            return;
        }
        else if (sVal === '') {
            this.setStateAndNotify({ min: '' });
            return;
        }
        this.setStateAndNotify({ min: iVal });
    },
    onChangeMax: function(){
        var sVal = this.refs.max.getDOMNode().value,
            iVal = Number(sVal);
        if (sVal !== '' && (!_isNumber(iVal) || isNaN(iVal))) {
            this.setState({ max: this.state.max });
            return;
        }
        else if (sVal === '') {
            this.setStateAndNotify({ max: '' });
            return;
        }
        this.setStateAndNotify({ max: iVal });
    },
    onBlurMin: function () {
        var sVal = this.refs.min.getDOMNode().value,
            iVal = Number(sVal);
        if (sVal !== '') {
            this.changeMin(iVal);
        }
    },
    onBlurMax: function(){
        var sVal = this.refs.max.getDOMNode().value,
            iVal = Number(sVal);
        if (sVal !== '') {
            this.changeMax(iVal);
        }
    },
    onBtnMinChange: function(change){
        var nextMin = (this.state.min === '' ? 0 : this.state.min) + change;
        nextMin = Math.max(this.props.min, nextMin);
        if (nextMin > this.state.max) {
            this.setStateAndNotify({ min: nextMin, max: nextMin });
        }
        else {
            this.setStateAndNotify({ min: nextMin });
        }
    },
    onBtnMaxChange: function(change){
        var nextMax = (this.state.max === '' ? 0 : this.state.max) + change;
        nextMax = Math.min(this.props.max, nextMax);
        if (nextMax < this.state.min) {
            this.setStateAndNotify({ min: nextMax, max: nextMax });
        }
        else {
            this.setStateAndNotify({ max: nextMax });
        }
    },
    changeMin: function (val) {
        var min;
        if (this.state.max === '') {
            min = Math.max(this.props.min, val);
        }
        else if (val > this.state.max) {
            min = this.state.max;
        }
        else {
            min = val;
        }
        this.setStateAndNotify({ min: min });
    },
    changeMax: function (val) {
        var max;
        if (this.state.min === '') {
            max = Math.min(this.props.max, val);
        }
        else if (val < this.state.min) {
            max = this.state.min;
        }
        else {
            max = val;
        }
        this.setStateAndNotify({ max: max });
    },
    set: function(min, max){
        this.setState({ min: min, max: max });
    },
    render: function () {
        return (
            <div data-am-range>
                <div className="col min">
                    <button onClick={this.onBtnMinChange.bind(this, -1)} className="btn minus"><i className="icon-down-open-big"></i></button>
                    <input placeholder="min" type="text" className="inp min" value={this.state.min} onKeyUp={this.onKeyUpMin} onBlur={this.onBlurMin} onChange={this.onChangeMin} ref="min" />
                    <button onClick={this.onBtnMinChange.bind(this, 1)} className="btn plus"><i className="icon-up-open-big"></i></button>
                </div>
                <div className="col max">
                    <button onClick={this.onBtnMaxChange.bind(this, -1)} className="btn minus"><i className="icon-down-open-big"></i></button>
                    <input placeholder="max" type="text" className="inp max" value={this.state.max} onKeyUp={this.onKeyUpMax} onBlur={this.onBlurMax} onChange={this.onChangeMax} ref="max" />
                    <button onClick={this.onBtnMaxChange.bind(this, 1)} className="btn plus"><i className="icon-up-open-big"></i></button>
                </div>
            </div>
        );
    }
});