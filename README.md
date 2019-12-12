### @zecos/input

`@zecos/input` is a library for quickly creating React UI components with little to no boilerplate.

#### Installation

`yarn add @zecos/input`

`npm i -S @zecos/input`

#### Example

```tsx
// text.tsx

export const text = createInput(({helpers, state}) => {
    const {
      id,
      name,
      label,
      value,
      handleChange,
      handleBlur,
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
          onChange={handleChange}
          onBlur={handleBlur}
          id={id}
        />
      </div>
    )
})
```

```tsx
// Form.tsx

import React from "react"
import { validateName } from "@zecos/validate"
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
  * works very will with the [`@zecos/validators`](https://npmjs.org/@zecos/validators`) library
* `init`: initial value for the field
  * default is `""` (empty string)
  * if your input requires a number, make sure to change `""` to 0, likewise with other types `""` would be invalid for.

#### Select Example

To demonstrate the power an flexibility of these options, let's take a look at a select input.

```tsx
// select.tsx

const renderOption = ([key, label]) => {
  return (
    <option key={key} value={key}>
      {label}
    </option>
  )
}

export const select = createInput(({helpers, props}) => {
  const {
    id,
    name,
    value,
    onChange,
    onBlur,
    label,
    htmlFor,
  } = helpers

  return (
    <div>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      <select
        className={styles.selectGroup}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        id={id}
        value={value}
        aria-label={label}
      >
        {Object.entries((args[0] && args[0].options) || props.options).map(renderOption)}
      </select>
    </div>
  )
})
```

```tsx
// Form.tsx

import React from "react"
import { nameValidator } from "@zecos/validators"
import { text } from "./text"

export const Form = () => {
  const [FavoriteColor, favoriteColorState] = select({
    init: "blue",
    name: "favoriteColor",
  }, {options={{green: "Green", blue: "Blue"}}})

  return (
    <form className="form">
      <FavoriteColor options={{blue: "Blue", red: "Red"}}/>
      Favorite Color: {favoriteColorState.value}
      
    </form>
  )
}
```

Here, you can see we can either pass options through the initializer or through the props of the React component, and we can let our component decide which one to use.

#### Conclusion 

You can imagine how this can be used to create powerful, scalable UI components.

The flexibility and lack of boilerplate of this library will allow you to rapidly implement changes to your entire UI, and you're not stuck with one look like Material Design, bootstrap, or any other UI library. But you *can* still use those if you want. You get the best of both worlds.

So, create your UI library and share it with the world or with your team!