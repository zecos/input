import * as React from "react"
import { IFieldSingleState } from "@zecos/field/types"
import { field } from "@zecos/field"

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

export interface ReactFieldSingleActions {
  setValue: (newVal) => any
  reset: () => any
  setTouched: () => any
  refreshErrors: () => any
  getState: () => any
}

export interface IInputHelpers {
  title: string
  camel: string
  kebab: string
  "aria-label": string
  handleChange: (e: React.ChangeEvent) => void
  handleBlur: (e: any) => void
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
  const handleChange = e => setValue(e.target.value)
  const handleBlur = () => setTouched()

  return {
    handleChange,
    handleBlur,
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
  validate?: (inputs?: any) => Error[]
  props?: { [key: string]: any}
  useState?: boolean
  updater?: () => void
}

interface IInputProps {
  state: IFieldSingleState
  actions: ReactFieldSingleActions
  helpers: IInputHelpers
  props: { [key: string]: any }
}

export interface IInput {
  Cmpt: React.FC
  state: IFieldSingleState
  actions:ReactFieldSingleActions
  meta: IMeta
  helpers: IInputHelpers
  name: string
  [key: string]: any
}

interface IMeta {
  $$__inputs_type: string
}

export type InputCreator = (opts: IInputOpts) => IInput
type InputCreatorCreator = (InputCmpt: React.FC<IInputProps>) => InputCreator

const reactify = (fn, update) => (...args) => {
  fn(...args)
  update()
} 

const getInput = ({InputCmpt, init, validate, update, name, initialProps}) => {
    const actions = field({
      init: typeof init === "undefined" ? "" : init,
      validate,
    })
    const reactActions = {}
    const {getState, ...toReactify} = actions
    for (const actionName in toReactify) {
      reactActions[actionName] = reactify(actions[actionName], update)
    }
    
    const helpers = getHelpers({actions: reactActions, name})
    return {
      Cmpt: props => {
        const state = actions.getState()
        return (
          <InputCmpt
            props={{
              ...initialProps,
              ...props,
            }}
            helpers={helpers}
            state={state}
            actions={reactActions}
          />
        )
    },
    helpers,
    actions: {
      getState,
      ...reactActions,
    },
    named: {
      [name + "Actions"]: actions,
      [name + "Helpers"]: helpers,
    }
  }
}

let update:any = () => {
  throw new Error("Something went wrong. This should never happen.")
}
let inMulti = false
const createUpdater = () => {
  const [state, setState] = React.useState(false)
  let x = state
  return () => {
    x = !x
    setState(x)
  }
}

export const createInput = (InputCmpt):any => (opts: IInputOpts) => {
  const {init, name} = opts
  const validate = opts.validate || (() => [])
  const initialProps = opts.props || {}
  const _update = (inMulti && update) || createUpdater()

  // have to use singleton to make sure it doesn't create another
  // input every render and lose focus
  /*<[WithPropsFC, IInputHelpers]>*/
  const [{
    Cmpt,
    helpers,
    actions,
    named,
  }] = (inMulti && [getInput({
    InputCmpt,
    init,
    validate,
    update: _update,
    initialProps,
    name,
  })]) || React.useState(() => getInput({
    InputCmpt,
    init,
    validate,
    update: _update,
    name,
    initialProps,
  }))
  const meta = {$$__inputs_type: "input"}
  const state = actions.getState()
  const CmptWithProps = Cmpt

  const result:IInput = {
    Cmpt: CmptWithProps,
    state,
    actions: (actions as ReactFieldSingleActions),
    meta,
    helpers,
    [helpers.upperCamel]: CmptWithProps,
    [name + "State"]: state,
    [name + "Meta"]: meta,
    ...named,
    name,
  }
  result[name] = result
  const display = opts => displayFormData(result, opts)
  result[helpers.upperCamel + "Display"] = display
  result.display = display
  const log = (opts) => logFormData(result, opts)
  result["log" + helpers.upperCamel] = log
  result.log = log
  return result
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
  items?: any[]
  validate?: (inputs?: any[]) => Error[]
  props?: { [key: string]: any}
}

interface ILayoutProps {
  helpers: ILayoutHelpers
  items: any[]
  props: { [key: string]: any}
  errors: Error[]
}

const getType = val => {
  if (typeof val === "object" && typeof val.meta === "object") {
    return val.meta.$$__inputs_type
  }
  return "unknown"
}

const getUpdated = item => {
  const type = getType(item)
  if (type === "input") {
    return {
      ...item,
      state: item.actions.getState()
    }
  } else if (type === "layout") {
    return {
      ...item,
      items: item.items.map(getUpdated)
    }
  } else if (type === "multi") {
    return {
      ...item,
      items: item.items.map(getUpdated)
    }
  }
  return item
}

export interface ILayout {
  Cmpt: React.FC
  meta: IMeta
  helpers: ILayoutHelpers
  name: string
  errors: Error[]
  [key: string]: any
}

export type LayoutCreator = (opts: ILayoutOpts) => ILayout
type LayoutCreatorCreator = (LayoutCmpt: React.FC<ILayoutProps>) => LayoutCreator

const getLayout = ({LayoutCmpt, validate, name, items, initialProps}) => {
  const title = camelToTitle(name)
  const kebab = titleToKebab(title)
  const snake = kebabToSnake(kebab)
  const upperCamel = camelToUpperCamel(name)
  const helpers:ILayoutHelpers = {kebab, snake, title, name, upperCamel}
  const Cmpt = props => {
    items = items.map(getUpdated)
    const errors = validate(items)
    return (
      <LayoutCmpt
        items={items}
        props={{
          ...initialProps,
          ...props,
        }}
        errors={errors}
        helpers={helpers}
      />
    )
  }

  return {
    Cmpt,
    helpers,
  }
}

export const createLayout:LayoutCreatorCreator = LayoutCmpt => opts => {
  const { name } = opts
  if (typeof name === "undefined") {
    throw new Error("You must provide a camelcased name for the layout.")
  }
  let items = opts.items || []
  const initialProps = opts.props || {}
  const validate = opts.validate || (() => [])

  const [{
    Cmpt,
    helpers,
  }] = (inMulti && [getLayout({
    LayoutCmpt,
    validate,
    name,
    items,
    initialProps,
  })]) || React.useState(() => getLayout({
    LayoutCmpt,
    validate,
    name,
    items,
    initialProps,
  }))
  
  const errors = validate(items)
  const meta = {$$__inputs_type: "layout"}

  const result:ILayout = {
    Cmpt,
    items,
    errors,
    meta,
    helpers,
    name,
    [helpers.upperCamel]: Cmpt,
    [name + "Items"]: items,
    [name + "Errors"]: errors,
    [name + "Meta"]: meta,
    [name + "Helpers"]: helpers,
  }
  result[name] = result
  const display = opts => displayFormData(result, opts)
  result[helpers.upperCamel + "Display"] = display
  result.display = display
  const log = (opts) => logFormData(result, opts)
  result["log" + helpers.upperCamel] = log
  result.log = log
  return result
}

type MultiCreateFn = () => (ILayout | IInput)[]

interface ICreateMultiOpts {
  name: string
  validate?: (inputs: any[]) => Error[]
  init?: (ILayout | IInput)[]
  props?: { [key: string]: any}
}
const setMulti = (_update) => {
  inMulti = true
  update = _update
}
const unsetMulti = () => {
  inMulti = false
  update = () => {
    throw new Error("Something is wrong. This should never happen.")
  }
}

type TGetCmpt = (() => (ILayout | IInput))
type WithPropsAndStateFC = (props: any, state: any) => React.FC
interface IMultiSetState {
  Cmpt: React.FC
  helpers: ILayoutHelpers
  actions: {[key: string]: any}
}

export const createMulti = (MultiCmpt:any) => (opts: ICreateMultiOpts) => {
  const { name } = opts
  if (typeof name === "undefined") {
    throw new Error("You must provide a camelcased name for the multi-input.")
  }
  const init = opts.init || []
  const initialProps = opts.props || {}
  const validate = opts.validate || (() => [])
  const _update = createUpdater()
  const [state, setState] = React.useState(init)
  const [{Cmpt, helpers, actions}] = React.useState<IMultiSetState>(() => {
    const title = camelToTitle(name)
    const kebab = titleToKebab(title)
    const snake = kebabToSnake(kebab)
    const upperCamel = camelToUpperCamel(name)
    const helpers = {kebab, snake, title, name, upperCamel}
    let state = init
    const splice = (start:number, deleteCount:number, ...getCmpts: TGetCmpt[]) => {
      setMulti(_update)
      const cmpts = getCmpts.map(fn => fn())
      unsetMulti()
      const removedVals = state.slice(start, start + deleteCount - 1)
      state = [
        ...state.slice(0, start-1),
        ...cmpts,
        ...state.slice(start + deleteCount - 1)
      ]
      setState(state)
      return removedVals
    }
    const push = (...args: TGetCmpt[]) => {
      setMulti(_update)
      const cmpts = args.map(fn => fn())
      state = [...state, ...cmpts]
      unsetMulti()
      setState(state)
      return state.length
    }
    const pop = () => {
      const popped = state[state.length - 1]
      state = state.slice(0, state.length - 1)
      setState(state)
      return popped
    }
    const sort = (compareFn?) => {
      state = state.slice().sort(compareFn)
      setState(state)
      return state
    }
    const reverse = () => {
      state = state.slice().reverse()
      setState(state)
      return state
    }
    const shift = () => {
      const newState = state.slice()
      const shiftVal = newState.shift()
      state = newState
      setState(state)
      return shiftVal
    }
    const unshift = (...args: TGetCmpt[]) => {
      setMulti(_update)
      const newCmpts = args.map(fn => fn())
      const newState = [...newCmpts, ...state]
      state = newState
      unsetMulti()
      setState(state)
      return newState.length
    }
    const fill = (fn: TGetCmpt, start, end) => {
      setMulti(_update)
      state = [
        ...state.slice(0, start),
        ...([...new Array(end - start)].map(() => fn())),
        ...state.slice(end + 1)
      ]
      unsetMulti()
      setState(state)
    }
    const actions = {
      fill,
      unshift,
      shift,
      reverse,
      sort,
      pop,
      push,
      splice,
    }
    const Cmpt = props => {
      const errors = validate(state)
      return (
        <MultiCmpt
          items={state}
          props={{
            ...initialProps,
            ...props,
          }}
          errors={errors}
          helpers={helpers}
        />
      )
    }
    

    return {
      Cmpt,
      actions,
      helpers
    }
  })
  
  const newState = state.map(getUpdated)
  const errors = validate(newState)
  const meta = {$$__inputs_type: "multi"}
  
  // const CmptWithProps = Cmpt(initialProps, state)
  const result = {
    Cmpt,
    items:newState,
    errors,
    meta,
    helpers,
    name,
    actions,
    [helpers.upperCamel]: Cmpt,
    [name + "Items"]: newState,
    [name + "Errors"]: errors,
    [name + "Meta"]: meta,
    [name + "Helpers"]: helpers,
  }
  result[name] = result
  const display = (opts) => displayFormData(result, opts)
  result[helpers.upperCamel + "Display"] = display
  result.display = display
  const log = (opts) => logFormData(result, opts)
  result["log" + helpers.upperCamel] = log
  result.log = log
  return result
}

const getDisplayType = (item) => {
  if (typeof item === "object" && typeof item.meta === "object") {
    return item.meta.$$__inputs_type
  } else {
    return ""
  }
}


const displayLayout = ({items, name}, opts, level) => {
  return (
    <div style={{marginLeft: level * 10}}>
      <b style={{textAlign: "left", margin: "5px auto"}}>{name}</b>
      {items.map((item, i) => <div key={i}>{displayFormData(item, opts, level + 1)}</div>)}
    </div>
  )
}

const renderDisplayErrors = (errs, level) => {
  return (
    <div>
      {errs.map((err, i) => (
        <div style={{marginLeft: level * 10}} key={i}>
          {err.toString()}
        </div>
      ))}
    </div>
  )
}

const displayInput = ({state, name}, opts, level) => {
  if (opts.full) {
    return (
      <div style={{marginLeft: level * 10}}>
      <h4 style={{textAlign: "left", margin: "5px auto"}}>{name}</h4>
        value: {state.value}<br />
        errors: {renderDisplayErrors(state.errors, level + 1)}
        pristine: {"" + state.pristine}<br />
        touched: {"" + state.touched}<br />
      </div>
    )
  }
  return (
    <div style={{marginLeft: level * 10}}>
      {name}: {state.value}
    </div>
  )
}

const displayMulti = ({items, name}, opts, level) => {
  return (
    <div style={{marginLeft: level * 10}}>
      <h4 style={{textAlign: "left", margin: "5px auto"}}>{name}</h4>
      {items.map((item, i) => <div key={i}>{displayFormData(item, opts, level + 1)}</div>)}
    </div>
  )
    
  
}
export const displayFormData:any = (item, opts = {className: ""}, level=0) => {
  const type = getDisplayType(item)
  let result;
  switch(type) {
    case "layout":
      result = displayLayout(item, opts, level)
      break
    case "input":
      result = displayInput(item, opts, level)
      break
    case "multi":
      result = displayMulti(item, opts, level)
      break
  }
  if (!result) {
    return <div>Input Not Recognized</div>
  }
  return <div className={opts.className}>{result}</div>
}

const logLayout = ({items, name}, opts, level) => {
  return (
      "  ".repeat(level) + name + "\n" +
      items
        .map((item, i) => getFormData(item, opts, level + 1))
        .join("\n")
        + "\n"
  )
}

const logErrors = (errs, level) => {
  return (
      errs
        .map((err, i) => "  ".repeat(level) + err.toString())
        .join("\n")
  )
}

const logInput = ({state, name}, opts, level) => {
  if (opts.full) {
    return (
        [
          name ,
          `value: ${state.value}`,
          `errors: \n${logErrors(state.errors, level + 1)}`,
          `pristine: ${"" + state.pristine}`,
          `touched: ${"" + state.touched}`
        ].map(str => "  ".repeat(level) + str + "\n").join("")
    )
  }
  return "  ".repeat(level) + `${name}: ${state.value}`
}

const logMulti = ({items, name}, opts, level) => {
  return "  ".repeat(level) + name + "\n" +
    items.map(item => getFormData(item, opts, level + 1)).join("\n") + "\n"
}
export const getFormData:any = (item, opts = {}, level=0) => {
  const type = getDisplayType(item)
  let result;
  switch(type) {
    case "layout":
      result = logLayout(item, opts, level)
      break
    case "input":
      result = logInput(item, opts, level)
      break
    case "multi":
      result = logMulti(item, opts, level)
      break
  }
  return result
}

const logFormData = (items, opts) => {
  const result = getFormData(items, opts)
  if (!result) {
    console.log("Input not recognized")
  }
  console.log(result)
}