import * as React from "react"
import { IFieldzInputObject, IFieldzSingleState } from "@zecos/fieldz/types"
import { useField, ReactFieldzSingleActions } from "@zecos/react-fieldz"


const camelToTitle = camelCase => camelCase
  .replace(/([A-Z])/g, match => ` ${match}`)
  .replace(/([0-9]+)/g, match => ` ${match}`)
  .replace(/^./g, match => match.toUpperCase())
  .trim()

const titleToKebab = title => title
  .replace(/ ([A-Z])/g, match => `-${match.trim()}`)
  .toLowerCase()
  
const kebabToSnake = (kebab: string) => kebab.replace("-", "_")

const camelToUpperCamel = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)

export interface IInputHelpers {
  title: string
  camel: string
  kebab: string
  "aria-label": string
  onChange: (e: React.ChangeEvent) => void
  onBlur: (e: any) => void
  label: string
  name: string
  snake: string
  id: string
  htmlFor: string
  upperCamel: string
}

export const getHelpers = ({actions, name}): IInputHelpers => {
  const title = camelToTitle(name)
  const kebab = titleToKebab(title)
  const snake = kebabToSnake(kebab)
  const upperCamel = camelToUpperCamel(name)
  const camel = name
  const id = kebab
  const _name = kebab
  const label = title
  const htmlFor = _name
  const { setValue, setTouched } = actions
  const onChange = e => setValue(e.target.value)
  const onBlur = () => setTouched()

  return {
    onChange,
    onBlur,
    id,
    name: _name,
    label,
    "aria-label": title,
    camel,
    upperCamel,
    title,
    kebab,
    snake,
    htmlFor,
  }
}
export interface IInputOpts {
  name: string
  init?: any
  validate?: (inputs?: any[]) => Error[]
  props?: { [key: string]: any}
}

export const createInput = (InputCmpt): any => (opts: IInputOpts) => {
  const {init, name} = opts
  const validate = opts.validate || (() => [])
  const initialProps = opts.props || {}

  const [_, actions] = useField({
    init: typeof init === "undefined" ? "" : init,
    validate,
  })
  
  // have to use singleton to make sure it doesn't create another
  // input every render and lose focus
  const [[Cmpt, helpers]] = React.useState<[React.FC, IInputHelpers]>(() => {
      const helpers = getHelpers({actions, name})
      return [props => {
        const state = actions.getState()
        return (
          <InputCmpt
            props={{
              ...initialProps,
              ...props,
            }}
            helpers={helpers}
            state={state}
            actions={actions}
          />
        )
    }, helpers]
  })
  const meta = {$$__inputs_type: "input"}
  const state = actions.getState()

  return {
    Cmpt,
    state,
    actions,
    meta,
    helpers,
    [helpers.upperCamel]: Cmpt,
    [name + "State"]: state,
    [name + "Actions"]: actions,
    [name + "Meta"]: meta,
    [name + "Helpers"]: helpers,
    name,
  }
}

const byKey = inputs => {

}

export interface ILayoutHelpers {
  kebab: string
  snake: string
  title: string
  upperCamel: string
  name: string
}

export interface ILayoutOpts {
  name: string
  inputs?: any[]
  validate?: (inputs?: any[]) => Error[]
  props?: { [key: string]: any}
}

const getType = val => {
  if (typeof val === "object" && typeof val.meta === "object") {
    return val.meta.$$__inputs_type
  }
  return "unknown"
}

const getUpdated = item => {
  if (getType(item) === "input") {
    return {
      ...item,
      state: item.actions.getState()
    }
  } else if (getType(item) === "layout") {
    return {
      ...item,
      inputs: item.inputs.map(getUpdated)
    }
  }
  return item
}

export const createLayout = (LayoutCmpt: any) => (opts: ILayoutOpts) => {
  const { name } = opts
  if (typeof name === "undefined") {
    throw new Error("You must provide a camelcased name for the layout.")
  }
  let inputs = opts.inputs || []
  const validate = opts.validate || (() => [])
  const initialProps = opts.props || {}

  const [[Cmpt, helpers]] = React.useState<[React.FC, ILayoutHelpers]>(() => {
    const title = camelToTitle(name)
    const kebab = titleToKebab(title)
    const snake = kebabToSnake(kebab)
    const upperCamel = camelToUpperCamel(name)
    const helpers:ILayoutHelpers = {kebab, snake, title, name, upperCamel}
    const fc: React.FC = props => {
      inputs = inputs.map(getUpdated)
      const errors = validate(inputs)
      return (
        <LayoutCmpt
          inputs={inputs}
          props={{
            ...initialProps,
            ...props,
          }}
          errors={errors}
          helpers={helpers}
        />
      )
    }

    return [fc, helpers]
  })
  const errors = validate(inputs)
  const meta = {$$__inputs_type: "input"}

  return {
    Cmpt,
    inputs,
    errors,
    meta,
    helpers,
    name,
    [helpers.upperCamel]: Cmpt,
    [name + "Inputs"]: inputs,
    [name + "Errors"]: errors,
    [name + "Meta"]: meta,
    [name + "Helprs"]: helpers,
  }
}