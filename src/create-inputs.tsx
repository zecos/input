import * as React from "react"
import { IFieldzInputObject, IFieldzSingleState } from "@zecos/fieldz/types"
import { useField, ReactFieldzSingleActions } from "@zecos/react-fieldz"
import { isAbsolute } from "path"

// export interface ICreateInputzProperty extends IFieldzInputObject {
//   type: "select" | "text" | "textarea"
// }

// export interface ICreateInputzProperties {
//   [name: string]: ICreateInputzProperty
// }

// export interface ICreateInputsResult {
//   [name: string]: React.FC
// }

// export const createInputs = props => {
//   const result: ICreateInputsResult = {}
//   for (const name in props) {
//     const prop = props[name]
//     const { type, ...fieldzProps } = prop
//     const [ state, actions  ] = useFieldz(fieldzProps)
//     if (type === "select") {
//       result[name] = <Select
//         fieldName={name}
//         actions={actions}
//         state={state}
//         options={}
//       />
//     }
//   }
// }

const camelToTitle = camelCase => camelCase
  .replace(/([A-Z])/g, match => ` ${match}`)
  .replace(/([0-9]+)/g, match => ` ${match}`)
  .replace(/^./g, match => match.toUpperCase())
  .trim()

const titleToKebab = title => title
  .replace(/ ([A-Z])/g, match => `-${match.trim()}`)
  .toLowerCase()
  
const kebabToSnake = kebab => kebab.replace("-", "_")

export interface IInputProps {
  title: string
  camel: string
  kebab: string
  "aria-label": string
  onChange: (e: React.ChangeEvent) => void
  onBlur: (e: any) => void
  label: string
  value: any
  name: string
  id: string
  htmlFor: string
}

export const getHelpers = ({actions, name}) => {
  const title = camelToTitle(name)
  const kebab = titleToKebab(title)
  const snake = kebabToSnake(kebab)
  const id = kebab
  const _name = kebab
  const label = title
  const htmlFor = _name
  const { setValue, setTouched } = actions
  const value = actions.getState().value
  const onChange = e => setValue(e.target.value)
  const onBlur = () => setTouched()

  return {
    value,
    onChange,
    onBlur,
    id,
    name: _name,
    label,
    "aria-label": title,
    camel: _name,
    title,
    kebab,
    snake,
    htmlFor,
  }
}

export type InputzData = [
  JSX.Element,
  IFieldzSingleState,
  ReactFieldzSingleActions
]

export interface ICreateInputzCreatorReturnOpts extends IFieldzInputObject {
  name: string
}

// export type CreateInputzCreatorReturn =
//   (opts: ICreateInputzCreatorReturnOpts) => CreateInputzCreatorReturnFn

export type InputzCreatorFn = (opts: IInputProps) => any

export const createInput = (Cmpt): any => (opts, ...more) => {
  const {init, validate, name} = opts
  const [_, actions] = useField({
    init: typeof init === "undefined" ? "" : init,
    validate: validate || (() => []),
  })
  
  // have to use singleton to make sure it doesn't create another
  // input every render and lose focus
  const [cmpt] = React.useState(() => {
      const helpers = getHelpers({actions, name})
      return props => {
        const state = actions.getState()
        return (
          <Cmpt
            props={props}
            helpers={helpers}
            state={state}
            actions={actions}
            args={more}
          />
        )
    }
  })
  const meta = {name}

  return [cmpt, actions.getState(), actions, meta]
}

const getNewState = ([cmpt, _state, actions, meta]) => (
  [cmpt, actions.getState(), actions, meta]
)

export const createLayout = (Cmpt: any) => (opts) => {
  const { inputs, name } = opts
  const validate = opts.validate || (() => [])
  const [cmpt] = React.useState(() => {
    const title = camelToTitle(name)
    const kebab = titleToKebab(title)
    const snake = kebabToSnake(kebab)

    return props => {
      const newInputs = inputs.map(getNewState)
      const errors = validate(newInputs)
      return (<Cmpt
        inputs={newInputs}
        props={props}
        errors={errors}
        helpers={{
          name,
          snake,
          kebab,
          title
        }}
      />)
    }
  })
  const mappedInputs = inputs.reduce((acc, cur) => {
    const [_cmpt, _state, _actions, meta] = cur
    acc[meta.name] = cur
    return acc
  }, {})
  const errors = validate(inputs)

  return [cmpt, mappedInputs, errors]
}