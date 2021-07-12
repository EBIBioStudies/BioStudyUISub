import { ExtSubmissionType } from './../model/submission-extended-types';
// import { PtAttribute } from '../model/pagetab';
// import { isDefinedAndNotEmpty } from 'app/utils';

// export function findAttribute(pageTab: ExtSubmissionType, attributeName: string): PtAttribute[] {
//   const ptAttributes: PtAttribute[] = pageTab.attributes || [];
//   const attrMatchingName: PtAttribute[] = ptAttributes.filter((attribute) => attribute.name === attributeName);
//   const attrWithValidValue: PtAttribute[] = attrMatchingName.filter((attribute) =>
//     isDefinedAndNotEmpty(attribute.value as string)
//   );

//   return attrWithValidValue;
// }

export function getFirstProjectAccNo(submission: ExtSubmissionType): string {
  const { projects = [] } = submission;

  return projects.length === 0 ? '' : projects[0].accNo;
}
