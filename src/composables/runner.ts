// @ts-ignore
import { Go, fs } from "./wasm/wasm_exec.js"
import { nanoid } from 'nanoid'

const response = await fetch('double-entry-generator.wasm');
const wasmBin = await response.arrayBuffer();

const runGo = async (argv: string[]): Promise<string> => {
    const go = new Go()
    go.argv = argv;
    go.exit = (code: number) => {
        if (code > 0) {
            throw new GoRuntimeError("runtime exit", code)
        }
    };
    const { instance } = await WebAssembly.instantiate(wasmBin, go.importObject)
    let originalWriteSync = fs.writeSync
    let outputBuf = '';
    const decoder = new TextDecoder("utf-8");
    fs.writeSync = (fd: any, buf: BufferSource) => {
        console.log("buf: ",  decoder.decode(buf))
        outputBuf += decoder.decode(buf);
        return buf.byteLength;
    };
    try {
        await go.run(instance)
    } catch (error) {
        if (!(error instanceof Error)) {
            throw error
        }
        throw new GoPanicError(error.message)
    }
    fs.writeSync = originalWriteSync
    return outputBuf
}

export const translate = async (provider: string, inputText: string, config: string): Promise<string> => {
    console.log("Translating...")
    console.log(`${provider} ${inputText} ${config}`)
    if (provider === 'alipay') {
        inputText = inputText.slice(25);  // reduce the total length
        let last = inputText.indexOf('------------------------------------------------------------------------------------');
        inputText = inputText.slice(0, last); // workaround for exceed CLI length limit
    }
    const tmpEle = document.createElement('div')
    const tmpId = nanoid(7)
    tmpEle.setAttribute("id", tmpId)
    document.body.appendChild(tmpEle)
    try {
        const output = await runGo(['double-entry-generator', 'translate', '--provider', provider, '--config', config, '--output', tmpId, '--', inputText])
    } catch (err) {
        console.log(err)
        alert('转换出现错误！\n\n' + err)
    }
    const result = document.getElementById(tmpId)?.innerText!
    document.getElementById(tmpId)?.remove()
    return result
}

class GoRuntimeError extends Error {
    constructor(message: string, code: number) {
        super(`Runtime error code ${code} : ${message}`);
        this.name = "GoRuntimeError";
    }
}

class GoPanicError extends Error {
    constructor(message: string) {
        super(`Go Panic Error: ${message}`);
        this.name = "GoPanicError";
    }
}


export const getVersion = async (): Promise<string> => {
    let version = ""
    try {
        version = await runGo(['double-entry-generator', 'version'])
    } catch (err) {
        console.log(err)
        alert('获取版本信息出现错误！\n\n' + err)
    }
    return version
}
