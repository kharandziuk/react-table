var React = require('react/addons'),
    _ = require('underscore'),
    IM = require('immutable'),
    log = require('debug')('main');

window.myDebug = require("debug");

var D = React.DOM;

class Form extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var {errors} = this.props;
    var getFormGroup = (propName, name) => {
      return D.div(
        {className: 'form-group'},
        D.label(null, name),
        errors.has(propName) ? 
          D.label({className: 'pull-right'}, errors.get(propName)) : null,
        D.input({
          className: 'form-control',
          value: this.props.form.get(propName),
          onChange: _.partial(this.props.changeInputHandler, propName)
        })
      );
    };
    return D.form(
      {
        onSubmit: this.props.submitHandler.bind(this)
      },
      getFormGroup('firstName', 'First Name'),
      getFormGroup('lastName', 'Last Name'),
      getFormGroup('phone', 'Phone'),
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
        }),
        errors: IM.Map()
      };
    }
    submitHandler(e) {
      e.preventDefault();
      this.setState(function(prevState) {
        var {form, items} = prevState;
        var errors = this.validateNewItem(form);
        log(errors);
        if (_.isEmpty(errors)) {
          return _.extend(prevState, {
            items: items.push(form),
            form: form.clear(), 
            errors: IM.Map()
          });
        } else {
          return _.extend(prevState, {
            errors: IM.Map(errors)
          });
        }
      });
    }
    validateNewItem (newItem) {
      var errors = {};
      var {firstName, lastName, phone} = newItem.toJS();
      log(firstName);
      log(lastName);
      if (_.isUndefined(firstName) || firstName.length === 0) {
        errors.firstName = 'This field is required';
      }
      if (_.isUndefined(lastName) || lastName.length === 0) {
        errors.lastName = 'This field is required';
      }
      var phoneRegEx = /\+?\(?\d{2,4}\)?[\d\s-]{3,}/;
      if (phoneRegEx.test(phone)) {
        errors.phone = 'The phone number is invalid';
      }
      return errors;
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
            errors: this.state.errors,
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
