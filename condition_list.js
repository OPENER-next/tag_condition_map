  function createConditionTagMap(questions) {
    const conditionTagMap = [];

    for (const question of questions) {
      for (const condition of Object.values(question.conditions)) {
        // find equal pre-existing conditions
        let conditionIndex = conditionTagMap.findIndex((entry) => conditionEquality(entry.CONDITION, condition));
        // create new condition entry if none exists
        if (conditionIndex === -1) {
          conditionIndex = conditionTagMap.push({
            'DELFI_ID': question.question.id,
            'LABEL': question.question.name,
            'CONDITION': condition,
            'TAGS': new Map()
          }) - 1;
        }
        // assign values to conditions from current question
        if (question.answer.hasOwnProperty("constructor")) {
          for (const [key, value] of Object.entries(question.answer.constructor)) {
            const tagMap = conditionTagMap[conditionIndex].TAGS;
            if (!tagMap.has(key)) {
              tagMap.set(key, new Set());
            }
            tagMap.get(key).add(value);
          }
        }
        else if(Array.isArray(question.answer.input)) {
          for (const valueEntry of question.answer.input) {
            for (const [key, value] of Object.entries(valueEntry.osm_tags)) {
              const tagMap = conditionTagMap[conditionIndex].TAGS;
              if (!tagMap.has(key)) {
                tagMap.set(key, new Set());
              }
              tagMap.get(key).add(value);
            }
          }
        }
      }
    }
    return conditionTagMap;
  }


  function conditionEquality(conditionA, conditionB) {
    for (const [keyA, valueA] of Object.entries(conditionA.osm_tags)) {
      const valueB = conditionB.osm_tags[keyA];
      const isArrays = Array.isArray(valueA) && Array.isArray(valueB);

      if (valueB !== valueA || !(isArrays && arrayEquality(valueA, valueB))) {
        return false;
      }
    }
    return true;
  }


  function arrayEquality(array1, array2) {
    const array1Sorted = Array.from(array1).sort();
    const array2Sorted = Array.from(array2).sort();
    return array1.length === array2.length && array1Sorted.every((value, index) => value === array2Sorted[index]);
  }


  (async () => {
    const response = await fetch('https://raw.githubusercontent.com/OPENER-next/OpenStop/master/assets/datasets/question_catalog.json');
    const json = await response.json();
    const conditionTagMap = await createConditionTagMap(json);
    console.log(conditionTagMap);
    document.body.textContent = JSON.stringify(conditionTagMap, replacer, 2);
  })()


// Replace Set and Map objects with Array or JS Objects

function replacer(key, value) {
  if (value instanceof Map) {
    return Object.fromEntries(value.entries());
  }
  if (value instanceof Set) {
    return [...value.values()];
  }
  return value;
}
