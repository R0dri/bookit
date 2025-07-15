import { IonApp, IonContent, IonHeader, IonInput, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import Reservations from './pages/Reservations';
import Resources from './pages/Resources';

setupIonicReact();

const App: React.FC = () => {
    console.log("VAR FORM STORAGE", localStorage.getItem('path'));
    var path = localStorage.getItem('path');
    //  const [value, setValue] = useState('');

    const saveToken = (val: string) => {
        // setValue(val);
        console.log(val);
        localStorage.setItem('authToken', val);
        document.location.reload();
    };

    const login = (
        <IonApp>
            <IonReactRouter>
                    <IonRouterOutlet id="main" animated={false}>
                    <Route path="/" exact={true}>
                        <IonPage>
                            <IonHeader>
                                <IonToolbar>
                                    <IonTitle>Login</IonTitle>
                                </IonToolbar>
                            </IonHeader>
                            <IonContent className="ion-padding" fullscreen>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                }}>
                                    <IonInput
                                        label="Token"
                                        labelPlacement="floating"
                                        placeholder="Enter your token"
                                        onIonChange={e => saveToken(e.detail.value!)}
                                        style={{ maxWidth: 300, width: '100%' }}
                                    />
                                </div>
                            </IonContent>
                        </IonPage>
                    </Route>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );

    var mainApp = (
        <IonApp>
            <IonReactRouter>
                <IonSplitPane contentId="main">
                    <Menu />
                    <IonRouterOutlet id="main" animated={false}>
                        <Route path="/" exact={true}>
                            {(() => {
                                switch (path) {
                                    case null:
                                    case "/":
                                        return <Reservations />
                                    // case "/List":
                                    //     return <List />
                                    case "/Resources":
                                        // return <Resources />
                                        return <Page name={path.split('/')[1]} />
                                    default:
                                        return <Page name={path.split('/')[1]} />
                                }
                            })()}
                            {/* <Reservations /> */}
                        </Route>
                        {/* <Route path="/:name" exact={true}>
                <Reservations />
            </Route> */}
                        {/* <Route path="/" exact={true}>
              <Redirect to="/folder/Inbox" />
            </Route> */}
                        {/* <Route path="/folder/:name" exact={true}>
              <Page />
            </Route> */}
                    </IonRouterOutlet>
                </IonSplitPane>
            </IonReactRouter>
        </IonApp>
    );

    const token = localStorage.getItem("authToken");
    const trustedUntil = token && new Date(token); // token is ISO string
    console.log(token);
    console.log(trustedUntil);

    return trustedUntil && new Date() < trustedUntil
        ? mainApp : login;
    // ? <MainApp />
    // : <LoginScreen />;
};

export default App;
