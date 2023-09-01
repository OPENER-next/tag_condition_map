# delfi_attributes.json - Documentation

This file explains the schema according to wich the `delfi_attributes.json` file is built and should be parsed.

## Schema

The file is a List `[]` of Dictionarys `{}`. 

Every Dictionary must contain the following attributes:

### `DELFI_ID`

An integer that represents the DELFI-ID of the attribute that is in question. 


### `LABEL`

A string that represents the Label exactly as it is displayed in the DELFI-Book.

### `CONDITION`

Condition describes what conditions must be met so that the element is tested if they fulfill all conditions stated in `TAGS`. So, to reiterate, `CONDITION` selects the elements for which the tests are performed, while `TAGS` are the conditions that are tested for.

The value can either be a `CONDITION-dicionary` or a list of `CONDITION-dictionary`s. If its a list, the conditions are combined with an OR-operator.


### `CONDITION-dictionary`

A condition dictionary is a dictionary that can contain a number of keys. The value for those keys need ALL evalueate to true for the condition dictionary as a whole to be true. The keys are:
* `osm_tags`: A dictionary of OpenStreetMap-Keys and -values that all must be present for this sub-condition to be true. The keys are the OSM-Keys and the values are the OSM-Values. The values can be either a string, a list of strings or `true`. If the value is a list, the condition is true if any of the values in the list is present. If the value is `true`, the mere existence of the key is enough for the condition to be true.
* `osm_element`: A string that can be either `Node`, `OpenWay`, `ClosedWay`, `Relation` or a list of those strings. The condition is true if the element is of the type specified in the value. If the value is a list, the condition is true if the element is of any of the types specified in the list. If `osm_element` is not present, the condition is true for all element types.

### `TAGS`

`TAGS` is a dictionary with OpenStreetMap-Keys as keys and the values for those OpenStreepMap-Keys as values. The values can either be a string, a list of strings, or an empty list. If the value is a string, the condition is true if the element has the key and the value is equal to the value specified in the `TAGS`-dictionary. If the value is a list, the condition is true if the element has the key and the value is equal to any of the values specified in the list. If the value is an empty list, the condition is true if the element has the key, regardless of the value.
