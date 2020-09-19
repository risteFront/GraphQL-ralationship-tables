export type Resolver = (paranet: any, args: any, contex: any, info: any) => any;
export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
