import * as React from "react"
import { IFieldzInputObject, IFieldzSingleState } from "@zecos/fieldz/types"
import { useField, ReactFieldzSingleActions } from "@zecos/react-fieldz"

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

export const getHelpers  = ({name, actions }) => {
  const { setValue, setTouched } = actions
  const title = camelToTitle(name)
  const kebab = titleToKebab(title)
  const snake = kebabToSnake(kebab)
  const id = kebab
  const _name = kebab
  const value = actions.getState().value
  const label = title
  const htmlFor = _name
  const onChange = e => setValue(e.target.value)
  const onBlur = () => setTouched()

  return {
    id,
    name: _name,
    value,
    onChange,
    onBlur,
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
  const {init, validate} = opts
  const [_, actions] = useField({
    init: init || "",
    validate: validate || (() => []),
  })
  
  // have to use singleton to make sure it doesn't create another
  // input every render and lose focus
  const [cmpt] = React.useState(() => {
    return (passedProps) => {
      const state = actions.getState()
      const helpers = getHelpers({name: opts.name, actions})
      return <Cmpt props={passedProps} helpers={helpers} state={state} actions={actions} args={more} />
    }
  })

  return [cmpt, actions.getState(), actions]
}