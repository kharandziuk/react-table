var React = require('react');
var D = React.DOM;

class Form extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return D.form(
      { onSubmit: alert},
      D.div(
        {
          className: 'form-inline',
        },
        null,
        D.div(
            {className: 'form-group'},
            D.label(null, 'First Name'),
            D.input({className: "form-control"})
        ),
        D.div(
            {className: 'form-group'},
            D.label(null, 'Last Name'),
            D.input({className: "form-control"})
        )
      ),
      D.div(
          {className: 'form-group'},
          D.label(null, 'Phone'),
          D.input({className: "form-control"})
      ),
      D.button({type: 'submit', className: 'btn btn-default'}, 'Submit')
    );
  }
}

class App extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return D.div(
          {className: 'container'},
          D.div(
            {className: 'col-lg-offset-3'},
            React.createElement(Form),
            D.table({className: 'table'})
          )
      );
    }
}

React.render(
    React.createElement(App),
    document.body
);
