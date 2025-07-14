import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, calendarOutline, calendarSharp, constructOutline, constructSharp, cube, cubeOutline, cubeSharp, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, peopleOutline, peopleSharp, todayOutline, todaySharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';

import { useHistory } from 'react-router-dom';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'My Agenda',
    url: '/Agenda',
    iosIcon: todayOutline,
    mdIcon: todaySharp
  },
  {
    title: 'Reservations',
    url: '/',
    iosIcon: calendarOutline,
    mdIcon: calendarSharp
  },
  {
    title: 'Resources',
    url: '/Resources',
    iosIcon: cubeOutline,
    mdIcon: cubeSharp 
  },
  {
    title: 'Services',
    url: '/Services',
    iosIcon: constructOutline,
    mdIcon: constructSharp
  },
  {
    title: 'Clients',
    url: '/Clients',
    iosIcon: peopleOutline,
    mdIcon: peopleSharp 
  }
];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {

  const history = useHistory();
  const location = useLocation();

  const route = (e: React.MouseEvent<HTMLIonItemElement>, url: string) => {
    e.preventDefault();

    const isSame = location.pathname === url;
    const ts = Date.now();

    localStorage.setItem('path', url);
    window.location.reload();
    if (isSame) {
      // Reload by adding query param
    //   history.replace(`${url}?r=${ts}`);
    } else {
      // Navigate normally
    //   history.push(url);
    }
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Book It!</IonListHeader>
          <IonNote>Resource Reservations</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} onClick={(e)=>route(e,appPage.url)}  routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        {/* <IonList id="labels-list">
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon aria-hidden="true" slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList> */}
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
