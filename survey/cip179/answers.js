// What the export makes of a response: CIP-179 answers turned into a
// SurveyJS answer row (the format of `<year>/data/answers.json`), through the
// mapping made by `definition.js`.

import { decodeChunkedText } from "cip-179";

/** CIP-179 answer items → a SurveyJS answer row. */
export function answersToRow(answers, mapping) {
  const row = {};
  const problems = [];
  for (const answer of answers) {
    const { name, values, levels, none } = mapping[answer.questionIndex];
    switch (answer.type) {
      case "singleChoice":
        row[name] = values[answer.optionIndex];
        break;
      case "multiSelect":
        row[name] = answer.optionIndices.length === 0 && none !== undefined ? [none] : answer.optionIndices.map((i) => values[i]);
        break;
      case "rating":
        row[name] = Object.fromEntries(answer.ratings.map((r) => [values[r.optionIndex], levels[Number(r.rating)]]));
        break;
      case "custom":
        // Any metadatum is a valid custom answer; ours are text.
        try {
          row[name] = decodeChunkedText(answer.value);
        } catch {
          problems.push(`${name}: the answer isn't text`);
        }
        break;
    }
  }
  return { row, problems };
}

/**
 * Leaves out the answers to questions the conditions hide, as the widget
 * would have. Responses submitted with other tools may answer them anyway.
 */
export function withoutHiddenAnswers(definition, conditions, answers) {
  const byQuestion = new Map(answers.map((a) => [a.questionIndex, a]));
  const hidden = [];
  definition.questions.forEach((_, index) => {
    const rule = conditions[index];
    if (!rule) return void hidden.push(false);
    const source = hidden[rule.question] ? undefined : byQuestion.get(rule.question);
    const matched = selectedOptions(source).some((o) => (rule.anyOf ?? rule.noneOf).includes(o));
    hidden.push(rule.anyOf ? !matched : matched);
  });
  return {
    answers: answers.filter((a) => !hidden[a.questionIndex]),
    hidden: answers.filter((a) => hidden[a.questionIndex]).map((a) => a.questionIndex),
  };
}

/** The options an answer selects, as conditions name them: a multi-select with none selected is "none". */
function selectedOptions(answer) {
  if (answer?.type === "singleChoice") return [answer.optionIndex];
  if (answer?.type === "multiSelect") return answer.optionIndices.length === 0 ? ["none"] : answer.optionIndices;
  return [];
}
