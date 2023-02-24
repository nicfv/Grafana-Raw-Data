# Grafana Raw Data Panel

[![Build](https://github.com/nicfv/Grafana-Raw-Data/actions/workflows/build.yml/badge.svg)](https://github.com/nicfv/Grafana-Raw-Data/actions/workflows/build.yml)

This is a simple Grafana panel plugin that supports any query and outputs the raw query data in JSON format.

This panel is designed to assist in plugin development and for deep exploration in data sources.

## Pseudo JSON Path

Using the pseudo-JSON path, you can extract data out of larger objects. See below for a list of special characters and a short list of examples.

### Special Characters

- For objects, use `.` to separate field names and `%.` to escape periods within field names.
    - The path `field%.name` will extract the data under `"field.name"` (one step down)
    - The path `field.name` will extract the data under `"field"."name"` (two steps down)
- For arrays, use `[i]` where `i` is an integer to extract a single element of an array, and `[*]` or `.*` to extract an entire array.
- The paths `field.*` and `field[*]` are equivalent.

```json
{
    "format": "JSON",
    "name": {
        "first": "John",
        "last": "Smith"
    },
    "contact": [
        {
            "type": "cell",
            "val": 1234567890
        },
        {
            "type": "email",
            "val": "john.smith@email.com"
        }
    ]
}
```

| Input | Output |
| - | - |
| `name` | `{ "first": "John", "last": "Smith" }` |
| `name.first` | `"John"` |
| `contact.*` | `[ { "type": "cell", "val": 1234567890 }, { ... } ]` |
| `contact.*.val` | `[ 1234567890, "john.smith@email.com" ]` |
| `contact[*].val` | `[ 1234567890, "john.smith@email.com" ]` |
| `contact[0]` | `{ "type": "cell", "val": 1234567890 }` |
| `contact[0].type` | `"cell"` |
| `id` | No value (doesn't exist) |