export function strFmt(str: string, data: Record<string, string>) {
  const regex = [/\{([^}]+)\}/g, /\{(.*)\}/];
  const matcher = (matched: string) => {
    const regexMatch = matched.match(regex[1]);
    if (regexMatch) {
      const match = regexMatch[1];
      return data[match];
    } else {
      return '';
    }
  };

  return str.replace(regex[0], matcher);
}
