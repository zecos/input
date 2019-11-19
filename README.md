### @zecos/ui


#### Installation

`yarn add @zecos/ui`

`npm i -S @zecos/ui`

#### About

`@zecos/ui` is a library for quickly creating form fields in conjunction with `@zecos/react-fieldz`. It provides several simple UI components for rapid form prototyping:

* `TextInput`
  * `({actions, state, fieldName}) => <input />`
* `TextArea`
  * `({actions, state, fieldName}) => <textarea />`
* `Select`
  * `({actions, state, fieldName, options}) => <select />`


#### Example

```tsx
import React from "react"
import { nameValidator } from "@zecos/validatorz"
import { useFieldz } from "@zecos/react-fieldz"
import { TextInput, TextArea, Select } from "@zecos/ui"

const fieldProperties = {
  name: {
    init: "",
    validate: nameValidator,
  },
  describeYourself: {
    init: "",
  },
  favoriteColor: {
    init: "red",
  },
}

const colors = {
  red: "Red",
  green: "Green",
  blue: "blue",
}

export const Form = () => {
  const [state, actions] = useFieldz(fieldProperties)

  <form className="form">
    <TextInput
      fieldName="name"
      state={state}
      actions={actions}
    />
    <TextArea
      fieldName="describeYourself"
      state={state}
      actions={actions}
    />
    <Select
      fieldName="favoriteColor"
      state={state}
      actions={actions}
      options={colors}
    />
  </form>
}
```