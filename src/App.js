import React, { Component } from "react";
import DynamicForm from "./components/DynamicForm";
import "./App.css";

class App extends Component {
  state = {    
    current: {}
  }; 
  render() {

    return (
      <div className="App">
       
        <DynamicForm
          key={this.state.current.id}
          className="form"
        //  title="Registration"
          defaultValues={this.state.current}
          model={[
            { key: "name", label: "Name", name:"name" ,props: { required: true } },
            { key: "number", label: "Mobile Number", name:"number", type: "text", props: { required: true ,pattern:"[6789][0-9]{9}"} },
            { key: "textarea", label: "Text Area",name:"textarea", type: "textarea", props: { required: true } },
            { key: "email", label: "Email", name:"email", type: "text", props: { required: true,
              pattern:"(^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$)" } },         
            {
              key: "gender",
              label: "Gender",
              type: "radio",
              name:"gender",
              options: [
                { key: "male", label: "Male", name: "gender", value: "male" },
                {
                  key: "female",
                  label: "Female",
                  name: "gender",
                  value: "female"
                }
              ]
            },         
            {
              key: "city",
              label: "City",
              type: "select",
              value: "Kerala",
              name:"city",
              options: [
                { key: "mumbai", label: "Mumbai", value: "Mumbai" },
                { key: "bangalore", label: "Bangalore", value: "Bangalore" },
                { key: "kerala", label: "Kerala", value: "Kerala" }
              ]
            },
            {
              key: "mcity",
              label: "Select Multiple City",
              type: "multiselect",
              value: "Mumbai",
              name:"mcity",
              options: [
                { key: "mumbai", label: "Mumbai", value: "Mumbai" },
                { key: "bangalore", label: "Bangalore", value: "Bangalore" },
                { key: "kerala", label: "Kerala", value: "Kerala" }
              ]
            },
            {
              key: "skills",
              label: "Skills",
              type: "checkbox",
              name:"skills",
              props: { required: true },
              options: [
                { key: "reactjs", label: "ReactJS", value: "reactjs" },
                { key: "angular", label: "Angular", value: "angular" },
                { key: "vuejs", label: "VueJS", value: "vuejs" }
              ]
            }
          ]}         
        />

        {/* <table border="1">
          <tbody>{data}</tbody>
        </table> */}
      </div>
    );
  }
}

export default App;
