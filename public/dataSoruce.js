function getChartData(useRemote = false) {
  if (!useRemote) {
    return Promise.resolve([
      {
        id: "F101A",
        name: "F101A",
        periods: [
          { id: "r1", start: "2025-04-24", end: "2025-04-25" },
          { id: "r2", start: "2025-04-25", end: "2025-04-30" },
        ],
      },
      {
        id: "F102A",
        name: "F102A",
        periods: [{ id: "r3", start: "2025-04-15", end: "2025-04-29" }],
      },
    ]);
  }

  const url =
    "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiTAZbr02NShOUr5siGdsibSW5_7QejFd9NAD8Ffa3UkTGsUsVe8QObWegQr_GIQP6ZRqq-9B5UDMlTDavMJcixb_tIBj88CGPRpQWGUHqQvZishLPPNc86z-GFQTeK3enfMvI3kt_gAlS3vbyHMykpaLBT9jmHlWjPiH7Da4g8LKT4r-DjzmnvHmpl8EkkPlYJ8KuSkoGRilvZRKV4QvghFmdH07rJHqnvotM0h5gqBx0AxK4kWKr8B2AYjJqq2QwCu3Dr8DUquqC1fSaDsUIrBX_DUQ&lib=MkJ7uGJkHfN76eQG8zfpWLC26SGljAL37";

  return fetch(url)
    .then((res) => res.json())
    .then((raw) => {
      
      const grouped = {};

      raw.forEach((entry) => {
        const resource = entry["Resource"];
        const match = resource.match(/^([A-Z]+)\d+/); // Match prefix like "SALA" from "SALA4001"
        const groupKey = match ? match[1] : "Other";
      
        // Initialize group if needed
        if (!grouped[groupKey]) {
          grouped[groupKey] = {};
        }
      
        // Initialize specific resource if needed
        if (!grouped[groupKey][resource]) {
          grouped[groupKey][resource] = {
            id: resource,
            name: resource,
            full_name: entry["Resource Name"] ?? "-",
            description: entry["Resource Description"].replaceAll('\n','</br>') ?? "---",
            periods: [],
          };
        }
      
        // Now it's safe to push
        grouped[groupKey][resource].periods.push({
          id: `${resource}-${grouped[groupKey][resource].periods.length + 1}`,
          start: new Date(entry["Check-In"]).getTime(),
          end: new Date(entry["Check-Out"]).getTime(),
          name: entry["Name"],
          address: entry["Address"],
          comments: entry["Comments"].replaceAll('\n','</br>'),
          // description: entry["Description"]
        });
      
        grouped[groupKey][resource].value += 1; // Increment count or compute duration if needed
      });
      
      // Transform into hierarchical structure
      const data = Object.entries(grouped).map(([groupName, resources]) => ({
        name: groupName,
        // description: "asdf",
        children: Object.values(resources).map(resource => ({
          id: resource.id,
          name: resource.name,
          //value: resource.value,
          periods: resource.periods,
          full_name: resource.full_name,
          description: resource.description
        }))
      }));
      
      console.log(data);
      return data;




    });
}


/*
      const grouped = {};

      raw.forEach((entry) => {
        const resource = entry["Resource"];

        if (!grouped[resource]) {
          grouped[resource] = {
            id: resource,
            name: resource,
            periods: [],
          };
        }

        console.log(entry);
        grouped[resizeBy].periods.push({
          id: `${resource}-${grouped[resource].periods.length + 1}`,
          start: new Date(entry["Check-In"]).getTime(), //.slice(0, 10),
          end: new Date(entry["Check-Out"]).getTime(), //.slice(0, 10),
          name: entry["Name"]
          // fill: "#ef0"
        });
      });

      //return Object.values(grouped);
      */