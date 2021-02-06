import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { AppRouter } from "./misc/AppRouter";
import { appStore } from "./stores/appStore";

const helmetContext = {};

const App: React.FC = () => {
  return (
    <HelmetProvider context={helmetContext}>
      <Provider store={appStore}>
        <AppRouter />
      </Provider>
    </HelmetProvider>
  );
};

export default App;
