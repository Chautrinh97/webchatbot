export type DepartmentNode = {
   _id : string,
   name: string,
   description: string,
   parentDepartmentId: string,
   children: DepartmentNode[],
   expand: boolean,
}