export const init_wasm = () => {
    if (!('WebAssembly' in window)) {
        document.body.innerText = '对不起，此应用需要浏览器支持 WebAssembly 能力。';
        throw Error("WebAssembly not supported");
    }

    if (!WebAssembly.instantiateStreaming) { // polyfill
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
            const source = await (await resp).arrayBuffer();
            return await WebAssembly.instantiate(source, importObject);
        };
    }
}
