var React = require('react'),
    createReactClass = require('create-react-class');
var Select = require('react-select');
require('react-select/dist/react-select.css');

/**
 * Component for editing a boolean.
 * @param  {string} value The value of the boolean.
 */
var SelectType = createReactClass({

	defaultValue: '',

	getInitialState: function(){
		return  {
			value: this.props.value
		};
	},

	render: function(){
        var options = this.renderOptions();
        return React.createElement(
            Select,
            {
                value: this.props.value,
                options: options,
                disabled: this.props.settings.readOnly,
                onChange: this.updateValue
            }
        );
	},

    optionRenderer: function(option) {
        return React.createElement(Highlighter, {});
    },

	renderOptions: function(){
		var opts = this.props.settings.options,
			options = []
		;
        options.push({value: 0, label: 'DELETE (set value to 0)', key: -1});

		if( !opts || !opts.length )
			return options;

		opts.forEach( function( opt, i ){
			var data = opt;
			if( typeof opt != 'object' )
				data = { value: opt, label: opt };

			options.push(
				{value: data.value, label: data.label, key: i}
			);
		});

		return options;
	},

	updateValue: function(e){
		this.props.onUpdated(e.value);
	},

	componentWillReceiveProps: function( nextProps ){
		if( this.props.value != nextProps.value )
			this.setState( { value: nextProps.value } );
	}
});

module.exports = SelectType;
