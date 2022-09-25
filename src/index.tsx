import "./index.css";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Parse from "parse";

import Root from "./navigation/root";
import { store } from "./store";

// initialting Parse Client
Parse.initialize("digius-crm");
Parse.serverURL = "http://localhost:1337/parse";

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById("root")
);
