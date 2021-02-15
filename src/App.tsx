import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { appStore } from "./data/appStore";
import { AppRouter } from "./misc/AppRouter";
import { SessionPlayer } from "./ui/standalone/SessionPlayer";

const helmetContext = {};

const App: React.FC = () => {
  return (
    <HelmetProvider context={helmetContext}>
      <Provider store={appStore}>
        <AppRouter>
          <SessionPlayer />
        </AppRouter>
      </Provider>
    </HelmetProvider>
  );
};

export default App;
