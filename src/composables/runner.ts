import { nanoid } from 'nanoid'
// @ts-expect-error ignore js type info missing
import { Go, fs } from './wasm/wasm_exec.js'
import { getWasmBin } from './load_wasm'

const runGo = async (argv: string[]): Promise<string> => {
  const go = new Go()
  go.argv = argv
  go.exit = (code: number) => {
    if (code > 0)
      throw new GoRuntimeError('runtime exit', code)
  }
  const { instance } = await WebAssembly.instantiate(await getWasmBin(), go.importObject)

  fs.clearBuf()
  try {
    await go.run(instance)
  }
  catch (error) {
    if (!(error instanceof Error))
      throw error

    throw new GoPanicError(error.message)
  }
  const stdoutContent = fs.getBuf()
  console.log(stdoutContent)
  return stdoutContent
}

export const translate = async (provider: string, inputText: string, config: string): Promise<string> => {
  console.log('Translating...')
  console.log(`${provider} ${inputText} ${config}`)
  if (provider === 'alipay') {
    inputText = inputText.slice(25) // reduce the total length
    const last = inputText.indexOf('------------------------------------------------------------------------------------')
    inputText = inputText.slice(0, last) // workaround for exceed CLI length limit
  }
  const tmpEle = document.createElement('textarea')
  const tmpId = nanoid(7)
  tmpEle.setAttribute('style', 'display: none')
  tmpEle.setAttribute('id', tmpId)
  document.body.appendChild(tmpEle)
  try {
    await runGo(['double-entry-generator', 'translate', '--provider', provider, '--config', config, '--output', tmpId, '--', inputText])
  }
  catch (err) {
    console.log(err)
    alert(`转换出现错误！\n\n${err}`)
  }
  let result = ''
  const ele = document.getElementById(tmpId)
  if (ele)
    result = ele.innerText

  document.getElementById(tmpId)?.remove()
  return result
}

class GoRuntimeError extends Error {
  constructor(message: string, code: number) {
    super(`Runtime error code ${code} : ${message}`)
    this.name = 'GoRuntimeError'
  }
}

class GoPanicError extends Error {
  constructor(message: string) {
    super(`Go Panic Error: ${message}`)
    this.name = 'GoPanicError'
  }
}

export const getVersion = async (): Promise<string> => {
  let version = ''
  try {
    version = await runGo(['double-entry-generator', 'version'])
  }
  catch (err) {
    console.log(err)
    alert(`获取版本信息出现错误！\n\n${err}`)
  }
  return version
}
