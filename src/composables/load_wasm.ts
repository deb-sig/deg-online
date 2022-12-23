
let wasmBin: BufferSource
const getWasmBin = async (): Promise<BufferSource> => {
    if (!wasmBin) {
        const response = await fetch('double-entry-generator.wasm');
        wasmBin = await response.arrayBuffer();
    }
    return wasmBin
}

export { getWasmBin }