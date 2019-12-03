### @zecos/inputs

`@zecos/inputs` is a library for quickly creating React UI components with little to no boilerplate.

#### Installation

`yarn add @zecos/inputs`

`npm i -S @zecos/inputs`

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
    validate: nameValidator,
    init: "Bob",
  })

  return (
    <form className="form">
      <FirstName /><br />
      First Name Value: {firstNameState.value}
      
    </form>
  )
}
```

For full example, see [@zecos/inputs-basic](https://github.com/zecos/inputs-basic), or better yet, fork it and create your own UI!

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
  * `label`: the form name in title case (for convenience)
  * `name`: the form name in snake case (for convenience)
  * `htmlFor`: same as `name`
  * `id`: the form name in snake case (for convenience)
* `args`: arguments passed after the `inputs` options
  * so in our example, after `{name: "firstName", ...}` you could pass additional arguments that would show up here.

The user is then passed your input, along with the form state and actions:

```ts
const [FirstName, firstNameState, firstNameActions] = text({
  name: "firstName",
  validate: nameValidator,
  init: "Bob",
})
```

The user can read all the values you can from `state` or perform any of the actions you can with `actions`, and each time your form will be rerendered. This gives you all the benefits of customization and and convenience of automatic generation.

The first argument given to `text` (`{name: "firstName", ...}`) are consumed by `inputs` and are used to generated the `helpers`/`state`/`actions` properties.

* `name`: is the name given to the form.
  * it is *crucial* that this is in camelcase in order to generate the proper title case, snake case, etc.. Make sure you communicate this to your user.
  * this is required
* `validate`: should be a function that takes the form value and outputs an array of errors.
  * not required (will just not validate anything)
  * works very will with the [`@zecos/validatorz`](https://npmjs.org/@zecos/validatorz`) library
* `init`: initial value for the field
  * default is `""` (empty string)
  * if your input requires a number, make sure to change `""` to 0, likewise with other types `""` would be invalid for.