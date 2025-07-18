import {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSpinner,
} from "@ionic/react";
import { useParams } from "react-router";
import React, { useEffect, useState } from "react";
import "./Reservations.css";

declare const anychart: any;

const Reservations: React.FC = () => {

    const { name } = useParams<{ name: string }>();
    const [loading, setLoading] = useState(true);
    console.log({name});

    useEffect(() => {
        anychart.onDocumentReady(async () => {


            anychart.format.inputLocale("es-bo");
            anychart.format.outputLocale("es-bo");
            // console.log(anychart.format.inputLocale());

            // # Get Data from Google
            const raw_data = await getChartData(true);
            console.log(raw_data);

            //   const data = fill_unavailable(raw_data);
            const data = raw_data;
            console.log(data);

            // ###
            // # Configuration Object
            // ###
            // Define the zoom level type
            type ZoomLevel = 'nightly' | 'half_hour';

            // Update the config object to use the specific type
            const config = {
                pxPorDia: 4,
                block: {
                    slanted: false,
                    slantRatio: 1.8,
                    gap: 2, //px
                    color: "#e57373",
                    heightOffset: 3,
                },
                unitWidth: 40, // Approx width of a day in px (adjust as needed)
                unitHeight: 20, // Approx width of a day in px (adjust as needed)
                zoomLevel: "half_hour" as ZoomLevel, // Type assertion to ensure it's a valid key
            };

            // # Generate Chart
            const treeData = anychart.data.tree(data, "as-tree");
            const chart = anychart.ganttResource();
            chart.data(treeData);

            // ✅ Desactivar primera columna (ID)
            chart.dataGrid().column(0).enabled(false);
            // chart.dataGrid().column(1).width(100); // or 'auto' sometimes works
            chart.dataGrid().column(1).width(111); // or 'auto' sometimes works
            // chart.dataGrid().column(1).(60);
            chart.splitterPosition(110); // or smaller, in pixels

            chart.defaultRowHeight(45);//

            // ✅ Título personalizado en la segunda columna
            const hoy = new Date();
            const semana = Math.ceil(hoy.getDate() / 7);

            const fechaStr = hoy.toLocaleDateString("es-BO", {
                day: "numeric",
                month: "long",
            });

            const titulo = `<strong>${fechaStr}</strong><br>semana ${semana}`;

            const col1 = chart.dataGrid().column(1);
            col1.title().text(titulo);
            col1.title().fontColor("#64b5f6");
            col1.title().fontWeight(600);
            col1.title().hAlign("center");
            col1.title().useHtml(true); // permite salto de línea

            chart.dataGrid().tooltip().useHtml(true);
            chart.dataGrid().tooltip().format(`
      <span style='font-weight:600;font-size:12pt'>
      {%full_name}
      </span><br><br>
      {%description}
    `);


            // access data grid buttons
            var buttons = chart.dataGrid().buttons();
            buttons.normal().content(null);
            buttons.hovered().content(null);
            buttons.selected().content(null);
            buttons.background().stroke(null);
            buttons.normal().background().fill({
                src: "https://cdn.anychart.com/samples/gantt-general-features/data-grid-buttons/close.png",
                mode: "stretch"
            });
            buttons.selected().background().fill({
                src: "https://cdn.anychart.com/samples/gantt-general-features/data-grid-buttons/open.png",
                mode: "stretch"
            });


            // chart.edit(true); // enables general editing
            // chart.getTimeline().edit(true);
            // chart.getTimeline().periods().edit(true);
            // chart.dataGrid().edit(true);


            // Escala y encabezado
            const timeline = chart.getTimeline();
            timeline.header().level(0).format("{%tickValue}{dateTimeFormat:HH:mm}");
            timeline.header().level(1).format("{%tickValue}{dateTimeFormat:dd/MMM  a}");

            timeline.tooltip().useHtml(true);
            timeline.tooltip().format(`
      <span style='font-weight:600;font-size:12pt'>
        {%start}{dateTimeFormat:HH:mm} - 
        {%end}{dateTimeFormat:HH:mm}</span><br><br>
        <strong>Reserva:</strong> {%Name}</br>
        <strong>Direccion:</strong> {%address}</br>
        </br>
        <strong>Comentarios:</strong></br>
          {%comments}
    `);


            // TODO: Monthly
            const zoomLevels: Record<ZoomLevel, { unit: string; count: number; }[][]> = {
                //   const zoomLevels = {
                nightly: [
                    [
                        { unit: "day", count: 1 },
                        { unit: "month", count: 1 },
                    ],
                ],
                half_hour: [
                    [
                        { unit: "minute", count: 30 },
                        { unit: "hour", count: 12 },
                    ],
                ],
            };

            // timeline.scale().zoomLevels(zoomLevels[config.zoomLevel]);

            const periods = timeline.periods();
            periods.height(config.unitHeight - 3); // adjust height as needed
            periods.rendering().drawer(function (this: any) {
                const { path } = this.shapes;
                const bounds = this.predictedBounds;

                const top = bounds.top - 10;
                const bottom = bounds.top + 10 + bounds.height;

                let left,
                    right,
                    slant = 0,
                    gap = (config.block.gap * bounds.height) / 10; // TODO: Not very reliable normalization

                if (config.block.slanted) {
                    const halfWidth = bounds.width / 2;
                    const center = bounds.left + halfWidth;

                    left = center - halfWidth;
                    right = center + halfWidth + bounds.width;
                    slant = bounds.height / config.block.slantRatio;
                } else {
                    left = bounds.left;
                    right = bounds.left + bounds.width;
                }

                path.clear();
                path
                    .moveTo(gap + left + slant, top)
                    .lineTo(-gap + right, top)
                    .lineTo(-gap + right - slant, bottom)
                    .lineTo(gap + left, bottom)
                    .close();
            });

            // # Shape Styling
            periods.rendering().shapes([
                {
                    name: "path",
                    shapeType: "path",
                    fill: "#e57373",
                    stroke: "none",
                    zIndex: 1
                },
                {
                    name: "unavailable",
                    shapeType: "path",
                    fill: "#ccc",
                    stroke: "none",
                    zIndex: 0
                },
            ]);

            // periods.rendering().shapes(function (d) {
            //   const isUnavailable = d.custom?.unavailable;
            //   return [
            //     {
            //       name: "path",
            //       shapeType: "path",
            //       fill: isUnavailable ? "#ccc" : "#e57373",
            //       stroke: "none",
            //       zIndex: isUnavailable ? 0 : 1 // optional: push unavailable blocks behind
            //     }
            //   ];
            // });

            // ###
            // # Perfect zoom
            // ###
            const unitOptions = [
                { unit: "minute", count: 15 },
                { unit: "minute", count: 30 },
                { unit: "hour", count: 1 },
                { unit: "hour", count: 2 },
                { unit: "hour", count: 4 },
                { unit: "day", count: 1 },
            ];

              const pxPerUnit = 4;
              const containerWidth = document.getElementById("reservations").offsetWidth;
              const units = Math.floor(containerWidth / pxPerUnit);

            //   const startDate = new Date();
            //   startDate.setDate(new Date());

            //   const endDate = new Date();
            //   endDate.setDate(endDate.getTime() + units);

            timeline.scale().minimum(new Date().setUTCHours(8, 0, 0, 0));
            timeline.scale().maximum(new Date().setUTCHours(24, 0, 0, 0) + units * 1000000);
              timeline.scale().zoomLevels(zoomLevels[config.zoomLevel]);

            // timeline.scale().calendar().workingTime([
            //   { from: 8, to: 20 } // Show only 08:00 to 20:00
            // ]);


            chart.container("reservations");
            chart.draw();

            setLoading(false);
        });
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Reservations</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen scrollY={false} forceOverscroll={false}>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Reservations</IonTitle>
                    </IonToolbar>
                </IonHeader>

                {loading && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 990,
                            background: "slategray",
                        }}
                    >
                        <IonSpinner name="crescent" />
                    </div>
                )}
                <div id="reservations" style={{ width: "100%", height: "100%"}}/>
            </IonContent>
        </IonPage>
    );
};

export default Reservations;