declare function generateTypes(typeObject: any, typescript: string, typeName: string, superstruct: string, isProperty?: boolean): {
    typescript: string;
    superstruct: string;
};
export default generateTypes;
