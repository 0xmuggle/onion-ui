import { FormatTypes, Interface } from "ethers/lib/utils";

// ABI JSON->String[]
export const formatJSON = (abis: any): Array<string> => {
  try {
    return new Interface(abis).format(FormatTypes.full) as Array<string>;
  } catch (e) {
    console.error("> formatJSON Error", e);
    return [];
  }
};

// ABI String->JSON
export const formatStr = (funStr: string): Record<string, any> => {
  try {
    const [result] = JSON.parse(
      new Interface([funStr]).format(FormatTypes.json) as string
    );
    return result;
  } catch (e) {
    // console.error("> formatStr Error", e);
    return {};
  }
};
