### @zecos/inputz

`@zecos/inputz` is a library for quickly creating React UI components with little to no boilerplate.

#### Installation

`yarn add @zecos/inputz`

`npm i -S @zecos/inputz`

#### Example

```tsx
// text.tsx

export const text = createInput(({helpers, state}) => {
    const {
      id,
      name,
      label,
      value,
      onChange,
      onBlur,
    } = helpers
    
    const {touched, errors} = state
    return (
      <div>
        <label className={styles.textLabel} htmlFor={name}>
          {label}
        {touched && errors[0].toString()}
        </label>
        <input
          name={name}
          aria-label={label}
          value={value}
          onChange={onChange}
          onBlur={onblur
          id={id}
        />
      </div>
    )
})
```

```tsx
// Form.tsx

import React from "react"
import { nameValidator } from "@zecos/validatorz"
import { text } from "./text"

export const Form = () => {
  const [FirstName, firstNameState, firstNameActions] = text({
    name: "firstName",
    validate: nameValdiator,
  })

  return (
    <form className="form">
      <FirstName /><br />
      First Name Value: {firstNameState.value}
      
    </form>
  )
}
```

For full example, see [@zecos/inputz-basic](https://github.com/zecos/inputz-basic), or better yet, fork it and create your own UI!

#### How it works

`createInput` takes a functional component that takes an object with the following properties:

* `props`: Properties actually passed to the component
  * in our example, it would look something like `<FirstName x="hello" />`, and `props` would be `{x: "hello"}`
* `state`: the field state, which includes
  * `value`: value of the field
  * `touched`: whether or not the user has focused and blurred the input
  * `errors`: the errors returned by your `validate` function
  * `pristine`: whether or not the field data has been manipulated
* `actions`:
  * `getState`: returns the same thing as `1`
  * `setValue`: set the value of the field (also runs validation and sets pristine to false)
  * `reset`: sets the field back to its original state (pristine, untouched, with the original init values)
  * `setTouched`: set the `touched` value to `true`
* `helpers`: premade functions and properties to make your life easier
  * `title`: the form name in title case
  * `camel`: the form name in camel case
  * `snake`: the form name in snake case
  * `aria-label`: the form name in title case (for convenience)
  * `onChange`: a function that sets the field value to the event's target value
  * `onBlur`: a function that sets the field's `touched` property to `true`
  * `value`: value of the field 
  * `label`: the form name in title case
  * `name`: the form name in snake case (for convenience)
  * `id`: the form name in snake case (for convenience)
  state: IFieldzSingleState
  actions: ReactFieldzSingleActions
