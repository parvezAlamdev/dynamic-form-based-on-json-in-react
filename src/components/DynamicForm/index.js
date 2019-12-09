import React from "react";
import ReactDOM from "react-dom";
import "./form.css";
import { postDataToEndPoint } from "../../service/postdata";
import Multiselect from "multiselect-dropdown-react";
import Select from "react-select";

export default class DynamicForm extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      receivedJSONDAsta: null,
      selectedOption: null,
      myError: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("gds:p:s", nextProps.defaultValues, prevState);

    let derivedState = {};

    if (
      nextProps.defaultValues &&
      nextProps.defaultValues.id !== prevState.id
    ) {
      //   Object.keys(prevState).forEach(k => {
      //     derivedState[k] = "";
      //   });
      return {
        ...nextProps.defaultValues
      };
    }

    console.log("no state change");
    return null;
  }
 
  componentDidMount() {
    let receivedData = this.props && this.props.model;
    this.setState({
      receivedJSONDAsta: receivedData
    });
  }
  submitSelectedDataToGivenEndPoints = value => {
    postDataToEndPoint(value);
  }; 
  handleChange = selectedOption => {
    this.setState({ selectedOption }, () =>
    postDataToEndPoint(this.state.selectedOption)     
      
    );
  };

  onChange = (e, key, type = "single") => {
    var array = [...this.state.myError]; 
    var index = array.indexOf(key);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({myError: array});
    }

    if (type === "single") {
      this.setState(
        {
          [key]: e.target.value
        },
        () => {}
      );
    } else {
      // Array of values (e.g. checkbox): TODO: Optimization needed.
      let found = this.state[key]
        ? this.state[key].find(d => d === e.target.value)
        : false;

      if (found) {
        let data = this.state[key].filter(d => {
          return d !== found;
        });
        this.setState({
          [key]: data
        });
      } else {
        console.log("found", key, this.state[key]);
        // this.setState({
        //   [key]: [e.target.value, ...this.state[key]]
        // });
        let others = this.state[key] ? [...this.state[key]] : [];
        this.setState({
          [key]: [e.target.value, ...others]
        });
      }
    }
  };

  handleBlur = (e, key, type = "single") => {    
    let data = this.state;
    if (e.target.validity.valid) {
      for (var prop in data) {
        if (prop == key) {
          if (data.hasOwnProperty(prop)) {
            this.submitSelectedDataToGivenEndPoints(data[key]);
          }
        }
      }
    } else {
      let isExists = this.state.myError.indexOf(key) > -1;
      if (!isExists) {
        var joined = this.state.myError.concat(key);
        this.setState({ myError: joined });
      }
    }
  };

  renderForm = () => {
    let model = this.state.receivedJSONDAsta;
    let defaultValues = this.props.defaultValues;

    let formUI =
      model &&
      model.map(m => {
        let key = m.key;
        let type = m.type || "text";
        let props = m.props || {};
        let name = m.name;
        let value = m.value;

        let target = key;
        value = this.state[target] || "";
        let input = (
          <input
            {...props}
            className={
              this.state.myError.indexOf(key) !== -1
                ? "form-input error-field"
                : "form-input "
            }
            type={type}
            key={key}
            name={name}
            value={value}
            onBlur={e => {
              this.handleBlur(e, target);
            }}
            onChange={e => {
              this.onChange(e, target);
            }}
          />
        );
        if (type == "textarea") {
         
            return (   
              <div className="form-group">     
                <div className="form-label">{m.label}</div>
                <textarea
                  {...props}
                  className={
                    this.state.myError.indexOf(key) !== -1
                      ? "form-input error-field"
                      : "form-input "
                  }
                 // className="form-input error-field"
                  type={type}
                  key={key}
                  name={key}
                
                  value={value}
                  onBlur={e => {
                    this.handleBlur(e, target);
                  }}
                  onChange={e => {
                    this.onChange(e, target);
                  }}
                />
                  
                </div>)
    
          
        }
        if (type == "radio") {
          input = m.options.map(o => {
            let checked = o.value == value;
            return (
              <React.Fragment key={"fr" + o.key}>
                <input
                  {...props}
                  className="form-input error-field"
                  type={type}
                  key={o.key}
                  name={o.name}
                  checked={checked}
                  value={o.value}
                  onBlur={e => {
                    this.handleBlur(e, o.name);
                  }}
                  onChange={e => {
                    this.onChange(e, o.name);
                  }}
                />
                <label key={"ll" + o.key}>{o.label}</label>
              </React.Fragment>
            );
          });
          input = <div className="form-group-radio">{input}</div>;
        }

        if (type == "select") {
          input = m.options.map(o => {
            let checked = o.value == value;
            //console.log("select: ", o.value, value);
            return (
              <option
                {...props}
                className="form-input"
                key={o.key}
                value={o.value}
              >
                {o.value}
              </option>
            );
          });

          //console.log("Select default: ", value);
          input = (
            <select
              value={value}
              onBlur={e => {
                this.handleBlur(e, m.key);
              }}
              onChange={e => {
                this.onChange(e, m.key);
              }}
            >
              {input}
            </select>
          );
        }
        if (type == "multiselect") {
          let dataForMultipleSelection = [];
          m.options.map(data => {
            let obj = {
              label: data.label,
              value: data.value
            };
            dataForMultipleSelection.push(obj);
          });

          input = (
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={dataForMultipleSelection}
              isMulti={true}
              blur={() => {
                alert("hi");
              }}
            />
          );
        }

        if (type == "checkbox") {
          input = m.options.map(o => {
            //let checked = o.value == value;
            let checked = false;
            if (value && value.length > 0) {
              checked = value.indexOf(o.value) > -1 ? true : false;
            }
            //console.log("Checkbox: ", checked);
            return (
              <React.Fragment key={"cfr" + o.key}>
                <input
                  {...props}
                  className="form-input"
                  type={type}
                  key={o.key}
                  name={o.name}
                  checked={checked}
                  value={o.value}
                  onChange={e => {
                    this.onChange(e, m.key, "multiple");
                  }}
                  onBlur={e => {
                    this.handleBlur(e, m.key, "multiple");
                  }}
                />
                <label key={"ll" + o.key}>{o.label}</label>
              </React.Fragment>
            );
          });

          input = <div className="form-group-checkbox">{input}</div>;
        }

        return (
          <div key={"g" + key} className="form-group">
            <label className="form-label" key={"l" + key} htmlFor={key}>
              {m.label}
            </label>
            {input}
          </div>
        );
      });
    return formUI;
  };

  render() {
    let title = this.props.title || "Dynamic Form";

    return (
      <div className={this.props.className}>
        <h3 className="form-title text-center">{title}</h3>
        <form className="dynamic-form align-item-center" >
        
          {this.renderForm()}</form>
      </div>
    );
  }
}
