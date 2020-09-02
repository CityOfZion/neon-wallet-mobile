declare module "react-native-native-neo-bindings" {
    const decryptNep2: (
        key: string,
        password: string,
    ) => Promise<string>;
    export default decryptNep2;
}