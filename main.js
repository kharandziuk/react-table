var React = require('react/addons'),
    _ = require('underscore'),
    IM = require('immutable');

var D = React.DOM;

class Form extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var getBindedInput = (propName) => {
      return D.input({
        className: 'form-control',
        value: this.props.form.get(propName),
        onChange: _.partial(this.props.changeInputHandler, propName)
      });
    };
    return D.form(
      {
        // ugly and 
        onSubmit: this.props.submitHandler.bind(this)
      },
      D.div(
        {
          className: 'form-inline',
        },
        D.div(
          {className: 'form-group'},
          D.label(null, 'First Name'),
          getBindedInput('firstName')
        ),
        D.div(
            {className: 'form-group'},
            D.label(null, 'Last Name'),
            getBindedInput('lastName')
        )
      ),
      D.div(
          {className: 'form-group'},
          D.label(null, 'Phone'),
          getBindedInput('phone')
      ),
      D.button({type: 'submit', className: 'btn btn-default'}, 'Submit')
    );
  }
}

class Table extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      console.log(this.props);
      return D.table(
        {className: 'table'},
        D.thead(
          null,
          D.tr(
            null,
            D.th(null, '#'),
            D.th(null, 'First Name'),
            D.th(null, 'Last Name'),
            D.th(null, 'Phone')
          )
        ),
        D.tbody(
          null,
          this.props.items.map(function(el, i) {
            return D.tr(
              null,
              D.th({scope: 'row'}, i),
              D.td(null, el.get('firstName')),
              D.td(null, el.get('lastName')),
              D.td(null, el.get('phone'))
            );
          })
        )
      );
    }
}

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        form: IM.Map({
          firstName: '',
          lastName: '',
          phone: ''
        }),
        items: IM.List([])
      };
    }
    submitHandler(e) {
      e.preventDefault();
      this.setState(function(prevState) {
        var {form, items} = prevState;
        return _.extend(prevState, {items: prevState.items.push(form)});
      });
    }
    changeInputHandler(propName, e) {
      var value = e.target.value;
      var newForm = this.state.form.merge({[propName]: value});
      this.setState(function(prevState) {
        return _.extend(prevState, {form: newForm});
      });
    }
    render() {
      return D.div(
          {className: 'container'},
          D.div(
            {className: 'col-lg-offset-3 col-lg-6'},
            React.createElement(Form, {
              form: this.state.form,
              submitHandler: this.submitHandler.bind(this),
              changeInputHandler: this.changeInputHandler.bind(this)
            }),
            React.createElement(Table, {items: this.state.items})
          )
      );
    }
}

React.render(
    React.createElement(App),
    document.body
);
