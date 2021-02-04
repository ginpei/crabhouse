import { Provider } from "react-redux";
import { AppRouter } from "./misc/AppRouter";
import { appStore } from "./stores/appStore";

const App: React.FC = () => {
  return (
    <Provider store={appStore}>
      <AppRouter />
    </Provider>
  );
};

export default App;
