import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 // function to convert to ascii
 export function convertToAscii(inputString: string) {
// remove any non ascii characters
const asciiString = inputString.replace(/[^\x00-\x7F]/g, "");
return asciiString;
}
