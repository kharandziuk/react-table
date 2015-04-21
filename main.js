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
      var {items, changeSortingHandler, sortBy, removeHandler} = this.props;
      var getHeadCell = (key, name) => {
        var span;
        if(key === sortBy.get('key')) {
          var direction = sortBy.get('isAsc') ? 'down' : 'up';
          span = D.span({
            className: `glyphicon glyphicon-chevron-${direction}`
          });
        }
        return D.th({onClick: _.partial(changeSortingHandler, key)}, name, span);
      };
      // TODO: refactor
      var sorted = this.props.items.map(
        (el, i) => _.extend(el.toObject(), {id: i})
      ).sort(
        (l, r) => {
          var {key, isAsc} = sortBy.toObject(),
              res,
              mul = isAsc ? 1 : -1;
          if (l[key] > r[key]) { res = 1; }
          else if (l[key] === r[key]) { res = 0; }
          else { res = -1; }
          return res * mul;
        }
      );
      var rows = sorted.map((el) => {
          return D.tr(
            {key: el.id},
            D.th({scope: 'row'}, el.id),
            D.td(null, el.firstName),
            D.td(null, el.lastName),
            D.td(null, el.phone),
            D.td(
              null,
              D.span({
                onClick: _.partial(removeHandler, el.id),
                className: 'glyphicon glyphicon-remove-sign'
              })
            )
          );
      });
      return D.table(
        {className: 'table'},
        D.thead(
          null,
          D.tr(
            null,
            getHeadCell('id', '#'),
            getHeadCell('firstName', 'First Name'),
            getHeadCell('lastName', 'Last Name'),
            getHeadCell('phone', 'Phone'),
            D.th(null, '')
          )
        ),
        D.tbody(
          null,
          rows
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
        items: IM.fromJS([1, 2, 3].map((el) => {
          return {
            firstName: 'firstName' + el,
            lastName: 'lastName' + el,
            phone: 'phone' + el
          };
        })),
        sortBy: IM.Map({
          key: 'id',
          isAsc: true
        })
      };
    }
    submitHandler(e) {
      e.preventDefault();
      this.setState(function(prevState) {
        var {form, items} = prevState;
        return _.extend(prevState, {
          items: items.push(form),
          form: form.clear()
        });
      });
    }
    changeInputHandler(propName, e) {
      var value = e.target.value;
      var newForm = this.state.form.merge({[propName]: value});
      this.setState(function(prevState) {
        return _.extend(prevState, {form: newForm});
      });
    }
    changeSortingHandler(key) {
      this.setState(function(prevState) {
        var {sortBy} = prevState;
        if (key === sortBy.get('key')) {
          sortBy = sortBy.update('isAsc', val => !val);
        } else {
          sortBy = sortBy.merge({key, isAsc:true});
        }
        return _.extend(prevState, {sortBy});
      });
    }
    removeHandler(i) {
      console.log(i);
      this.setState(function(prevState) {
        var {items} = prevState;
        items = items.delete(i);
        return _.extend(prevState, {items});
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
          React.createElement(Table, {
            items: this.state.items,
            sortBy: this.state.sortBy,
            changeSortingHandler: this.changeSortingHandler.bind(this),
            removeHandler: this.removeHandler.bind(this)
          })
        )
      );
    }
}

React.render(
    React.createElement(App),
    document.body
);
