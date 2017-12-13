var React = require('react'),
    createReactClass = require('create-react-class'),
    DOM = require('react-dom-factories'),
	TypeField = require('./TypeField')
;

/**
 * Component to add fields to an Object or Array.
 * @param  {FreezerNode} root The parent to add the attribute.
 * @param  {string} name Optional. If provided, the attribute added will have that key (arrays).
 *                           Otherwise an input will be shown to let the user define the key.
 */
var FieldAdder = createReactClass({
	getInitialState: function(){
		return {
			creating: this.props.creating || false,
			name: this.props.name,
			type: 'string'
		};
	},

	render: function(){
		if( !this.state.creating )
			return DOM.a({ className: 'jsonAdd', href: '#', onClick: this.handleCreate }, this.props.text );

		var options = this.getTypes().map( function( type ){
				return DOM.option({value: type, key: type}, type[0].toUpperCase() + type.slice(1));
			}),
			fieldName
		;

		if( typeof this.props.name != 'undefined' )
			fieldName =  [
				DOM.span({className: 'jsonName'}, this.props.name),
				DOM.span(null, ':')
			];
		else {
			fieldName = [
				DOM.input({ref: 'keyInput', type: 'text', value: this.state.value, onChange: this.changeKey}),
				DOM.span(null, ':')
			];
		}

		return DOM.div( {className: 'jsonField jsonFieldAdder'}, [
			fieldName,
			DOM.select({ key: 's', value: this.state.type, onChange: this.changeType, ref: 'typeSelector'}, options),
			DOM.button({ key: 'b', onClick: this.createField }, 'OK' ),
			DOM.a({ key: 'a', href: '#', className: 'cancelField', onClick: this.handleCancel}, 'Cancel')
		]);
	},

	componentDidUpdate: function( prevProps, prevState ){
		if( !prevState.creating && this.state.creating ){
			if( this.refs.keyInput )
				this.refs.keyInput.getDOMNode().focus();
			else
				this.refs.typeSelector.getDOMNode().focus();
		}
	},

	componentWillReceiveProps: function( newProps ){
		this.setState({name: newProps.name});
	},

	handleCreate: function( e ){
		e.preventDefault();
		this.setState({creating: true});
	},

	handleCancel: function( e ){
		e.preventDefault();
		this.setState({creating: false});
	},

	changeType: function( e ){
		this.setState({type: e.target.value});
	},

	changeKey: function( e ){
		this.setState({name: e.target.value});
	},

	createField: function(){
		this.setState({creating: false});

		var value = TypeField.prototype.components[ this.state.type ].prototype.defaultValue;

		this.props.onCreate( this.state.name, value, {type: this.state.type });
	},

	getTypes: function(){
		return Object.keys( TypeField.prototype.components );
	}
});

module.exports = FieldAdder;
