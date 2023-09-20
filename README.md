# tag_condition_map - A schema to make checking for completeness of accessibility OSM-Data easier

This repository contains the file `delfi_attributes.json`, which can be used to check if accessibility-related OSM-Data on public transport stops is complete. It uses the [DELFI-Handbook](https://www.delfi.de/media/delfi_handbuch_barrierefreie_reiseketten_1._auflage_mai_2018.pdf) as basis for what objects are checked for which attributes. Simply explained, it contains a list of conditions that connect objects that _do have_ certain OSM-Tags (e.g. tags that mark an object as a public transport information office) to tags that theese objects _should have_ to be in compliance with DELFI (e.g. tags that mark an object as wheelchair accessible).

## Schema
This section explains the schema according to wich the `delfi_attributes.json` file is built and should be parsed.

The file is a List `[]` of Dictionarys `{}`. Each dictionary represents one DELFI-attribute that is checked for.

Every Dictionary must contain the following attributes:

### `DELFI_ID`

An integer that represents the DELFI-ID of the attribute that is checked by this dictionary. 


### `LABEL`

A string that represents the Label exactly as it is displayed in the DELFI-Book.

### `CONDITION`

Condition describes what conditions must be met so that the element is tested if they fulfill all conditions stated in `TAGS`. So, to reiterate, `CONDITION` selects the elements for which the tests are performed, while `TAGS` are the conditions that are tested for.

The value can either be a `CONDITION-dicionary` or a list of `CONDITION-dictionary`s. In case of a list only one of the supplied CONDITION-dicionarys has to evaluate to true.


### `CONDITION-dictionary`

A condition dictionary is a dictionary that can contain a number of keys. The value for those keys need ALL evalueate to true for the condition dictionary as a whole to be true. The keys are:
* `osm_tags`: A dictionary of OpenStreetMap-Keys and -values that all must be present for this sub-condition to be true. The keys are the OSM-Keys and the values are the OSM-Values. The values can be either a string, a list of strings, `true` or `false`. If the value is a list, the condition is true if any of the values in the list is present. If the value is `true`, the mere existence of the key is enough for the condition to be true. If the value is `false`, the condition is true if the key is not present.
* `osm_element`: A string that can be either `Node`, `OpenWay`, `ClosedWay`, `Relation` or a list of those strings. The condition is true if the element is of the type specified in the value. If the value is a list, the condition is true if the element is of any of the types specified in the list. If `osm_element` is not present, the condition is true for all element types.

### `TAGS`

`TAGS` is a dictionary with OpenStreetMap-Keys as keys. Each key corresponds to a list of strings representing the expected values. If an empty list is supplied the exact value of the key is indeterminate. If `TAGS` is empty, the mere existence of an element that was selected by the `CONDITION` is enough to pass the test.
