function createTagMap(questions) {
    const tagMap = {};
    
    for (const question of questions) {
      for (const valueEntry of Object.values(question.input.values)) {
        for (const [key, value] of Object.entries(valueEntry.osm_tags)) {
          // create new tag key if it does not exist yet
          if (!tagMap.hasOwnProperty(key)){
            tagMap[key] = [];
          }
          // find index of already existing value for this tag
          let index = tagMap[key].findIndex((entry) => entry.value === value);
          // if entry exists
          if (index > -1) {
            tagMap[key][index]["conditions"].push(...structuredClone(question.conditions));
          }
          // if no entry for this value exists create new one and update index
          else {
            tagMap[key].push({
              "value": value,
              "conditions": structuredClone(question.conditions),
            });
            index = tagMap[key].length - 1;
          }
          
          //filter question "self" conditions
          for (const condition of tagMap[key][index]["conditions"]) {
            for (const [ckey, cvalue] of Object.entries(condition["osm_tags"])) {
              if (ckey === key && cvalue === false) {
                delete condition["osm_tags"][ckey];
              }
            }
          }
        }
      }
    }
    return tagMap;
  }

  function removeUnpreciseValues(map) {
    // each OSM tag (mainTag) and its possible values, each with its own corresponding conditions (mainValues)
    for (const [mainTag, mainValues] of Object.entries(map)) {
      // each entry in the array of possible OSM values
      for (const osmValue of Object.values(mainValues)) {
        var index = -1;
        // Conditions of each possible OSM value. Conditions are arrays with elements being "OR-connected"
        osmValue.conditions.forEach(condition => {
          // Only consider "osm_tags" as conditions (not osm_element)
          for (const [cOsmTag, cOsmValue] of Object.entries(condition.osm_tags)){
            // When OSM tag can be precised by another answer/OSM tag being defined in question catalog (removes mostly "yes")
            if (cOsmTag === mainTag && cOsmValue !== false){
              // Remove unprecise OSM tag from conditions
              delete condition.osm_tags[cOsmTag]
              // Find index/position of unprecise value in array (once per array if possible OSM values)
              if (index === -1) {
                index = mainValues.findIndex((e) => e.value === cOsmValue); // osmValue.value
              }
              if (index > -1) {
                // Get conditions of (soon to be removed) unprecise possible answer
                mainValues[index].conditions.forEach(function(condOld) {
                  osmValue.conditions.forEach(function(condNew) {
                    console.log("MainTag: " + mainTag);
                    transferConditionalTags(condOld.osm_tags, condNew.osm_tags);
                  });
                });
              }
            }
          }
        });
      }
      // Remove unprecise value for OSM tag
      if (index > -1) {
        mainValues.splice(index, 1)
      }
    }
    return map
  }

  // Compare and replace respectively add conditions to new more precise value
  function transferConditionalTags(elementOld, elementNew) {
    for (key in elementOld) {
      if (!(elementNew.hasOwnProperty(key))) {
        console.log("Tag not present");
        elementNew[key] = elementOld[key];
      }
      else {
        if (typeof(elementOld[key]) === "string" && typeof(elementNew[key]) === "string") {
          if (elementOld[key] != elementNew[key]) {
            console.log("Both strings not identical");
            elementNew[key] = [elementNew[key], elementOld[key]];
            console.log(elementNew[key]);
          }
        }
        else if (elementOld[key].isArray && elementNew[key].isArray) {
          console.log("Both arrays");
          elementNew[key] = Array.from(new Set(elementOld[key].concat(elementNew[key])));
        }
      }
    }
  }

  (async () => {
    const response = await fetch('https://raw.githubusercontent.com/OPENER-next/OpenStop/master/assets/datasets/question_catalog.json');
    const json = await response.json();
    const tagMap = await createTagMap(json);
    document.body.textContent = JSON.stringify(removeUnpreciseValues(tagMap), null, 4);
  })()