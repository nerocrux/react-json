'use strict';

var React = require('react'),
    DOM = require('react-dom-factories');
var moment = require('moment');

module.exports = {
	getStateFromProps: function( props ){
		return {
			editing: props.settings.editing || false,
			value: props.value
		};
	},

	renderInput: function(){
		var className = this.typeClass;

		if( !this.state.editing )
			return DOM.span( {onClick: this.setEditMode, className: className, readOnly: this.props.settings.readOnly}, this.getDisplayString() );

        if (this.props.settings.dateTime) {
            this.inputType = 'datetime-local';
        }

		return DOM.input({
			type: this.inputType,
			value: this.state.value,
			readOnly: this.props.settings.readOnly,
			id: this.props.id,
			placeholder: this.props.settings.placeholder || '',
			onChange: this.updateValue,
			onBlur: this.setValue,
			ref: 'input',
			onKeyDown: this.handleKeyDown
		});
	},

	getDisplayString: function(){
		if( this.getDisplayModeString )
			return this.getDisplayModeString();

		if( this.props.value === '' )
			return DOM.span( {className: 'jsonNovalue'}, 'No value' );

		return this.props.value;
	},

	componentWillReceiveProps: function( nextProps ){
		var nextState = {},
			update = false
		;

		if( this.props.value != nextProps.value ){
			update = true;
			nextState.value = nextProps.value;
		}
		if( this.props.settings.editing != nextProps.settings.editing ){
			update = true;
			nextState.editing = nextProps.editing;
		}
		if( update )
			this.setState( nextState );
	},

	componentDidUpdate: function( prevProps, prevState ){
		if( this.state.editing && ! prevState.editing || this.props.settings.focus ){
			this.focus();
		}
	},

	componentDidMount: function(){
		if( this.state.editing === true || this.props.settings.focus )
			this.focus();
	},

	setEditMode: function(){
		this.setState({editing: true});
	},

	setValue: function(){
		if( this.state.editing != 'always' )
			this.setState({editing: false});
		this.props.onUpdated( this.state.value );
	},

	toggleEditing: function(){
		this.setState({ editing: !this.state.editing });
	},

	handleKeyDown: function( e ){
		if( e.which == 13 )
			this.setValue();
	},

	focus: function(){
		var node = this.refs.input.getDOMNode();
		node.focus();
		node.value = node.value;
	}
};
