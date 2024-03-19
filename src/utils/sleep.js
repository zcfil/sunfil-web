const sleep = (ms) => new Promise(r => setTimeout(r, ms));
export const waitFor = async (f) => {
    let ret = f();
    while (!ret) {
        await sleep(50);
        ret = f();
    }
    return ret;
};
