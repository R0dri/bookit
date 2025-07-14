import { useEffect } from "react";
import { createGesture } from "@ionic/react";

import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';

const Resources: React.FC = () => {
  useEffect(() => {
    var el = document.getElementById('myIonPage');
    if(!el) return;

    let gesture = createGesture({
        el,
        threshold: 0,
        gestureName: 'my-gesture',
        gesturePriority: 40.5, // priority of swipe to go back is 40 
        onMove: ev => console.log(ev)
      });

    gesture.enable(true);

    return () => {
      gesture.destroy();
    };
  }, []);

//   return (
//     <div id="myIonPage" style={{ width: "100%", height: "100%" }}>
//         <h1>Resources list</h1>
//     </div>
//   );
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>asdf</IonTitle>
        </IonToolbar>
      </IonHeader>

    <IonContent fullscreen scrollY={false} forceOverscroll={false}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">asdf</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <ExploreContainer name={name} /> */}
      </IonContent>
    </IonPage>
  );
};

export default Resources;