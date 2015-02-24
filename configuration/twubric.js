
// // A rubric is a set of criterion with an absolute maximum score.
// //  criteria.weightage <= points
// Rubric {
//   Criteria[] criteria,
//   double points
// }

// // Each criterion has a label (Eg. Handwriting), a weightage (eg. 1) and is
// // mapped to a “Scale”.
// Criteria {
//   string label,
//   double weightage,
//   Scale scale
// }

// // A scale has a set of attributes and a maximum. (could be 100% if it is a
// // percentage scale or an absolute double number otherwise)
// Scale {
//   ScaleAttribute[] attribute,
//   double max
// }

// // Each attribute has a label (eg. Extraordinary) optionally has a lower and // upper range both of which are less than Scale.max (eg. 90% - 100%)
// ScaleAttribute {
//   numeric lowerRange,
//   numeric upperRange,
//   string label
// }
sample={}
sample.calculateTwubric = function(user){
  temp = { test:1 };
  return test;
}

module.exports=sample;
