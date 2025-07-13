const demo_availability = [
      {
        id: "F101A",
        resource: "F101A",
        status: "active",
        available: [
          { days: "mon-thu", from: "08:00", to: "17:00" },
          { days: "weekends", from: "10:00", to: "14:00" },
        ],
      },
      {
        id: "F102A",
        resource: "F102A",
        status: "active",
        available: [
          { days: "mon-thu", from: "08:00", to: "17:00" },
          { days: "weekends", from: "10:00", to: "14:00" },
        ],
      },
    ];

function fill_unavailable(data, availability=demo_availability){


    // availability.forEach(resource => {
    //     data.find(r)
    // })
    console.log(data);
    data[1].children[data[1].children.length - 1].periods.push({
              id: "UNVLB_opening",
              name: "Mantenimiento",
              start: new Date().setHours(12-4,0,0,0),
              end: new Date().setHours(24-4,0,0,0),
              fill: "#ccc",
              stroke: "0 #ccc"
          })

    // return data;
    // data.forEach( (resource,i) => {
    //     resource.periods.push({
    //         id: "UNVLB_"+resource.id+"_opening",
    //         start: new Date().setHours(0,0,0,0),
    //         end: new Date().setHours(4,0,0,0),
    //         fill: "#ccc",
    //         stroke: "0 #ccc"
    //     })
    //     resource.periods.push({
    //         id: "UNVLB_"+resource.id+"_launch",
    //         start: new Date().setHours(8,0,0,0),
    //         end: new Date().setHours(9,0,0,0),
    //         fill: "#ccc",
    //         stroke: "0 #ccc"
    //     })
    // });

    return data;
}

const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function dayMatches(rule, day) {
  const idx = dayMap.indexOf(day);
  if (rule === "weekends") return idx === 0 || idx === 6;
  if (rule === "weekdays") return idx >= 1 && idx <= 5;
  if (rule.includes("-")) {
    const [start, end] = rule.split("-").map(d => dayMap.indexOf(d));
    return start <= idx && idx <= end;
  }
  return rule === day;
}