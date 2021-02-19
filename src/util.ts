export function getNameResolver(baseName: string, resourceName: string): (name?: string) => string {
  return (name?: string) => {
    return [...new Set([baseName, resourceName, name])]
      .filter(x => !!x)
      .join('-');
  };
}
