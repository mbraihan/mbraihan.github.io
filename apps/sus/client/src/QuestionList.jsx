// import Question from './Question.jsx';
// export default function QuestionList({ questions, onChange }) {
//   return (
//     <>
//       {questions.map((q, idx) => (
//         <Question key={idx} index={idx} text={q} onChange={onChange} />
//       ))}
//     </>
//   );
// }

import Question from './Question.jsx';

export default function QuestionList({ questions, onChange, selectedValues = {} }) {
  return (
    <>
      {questions.map((q, idx) => (
        <Question
          key={idx}
          index={idx}
          text={q}
          onChange={onChange}
          selectedValue={selectedValues[idx]}
        />
      ))}
    </>
  );
}

// import Question from './Question.jsx';

// export default function QuestionList({ questions, onChange, selectedValues = {} }) {
//   return (
//     <>
//       {questions.map((q, idx) => (
//         <Question
//           key={idx}
//           index={idx}
//           text={q}
//           onChange={onChange}
//           selectedValue={selectedValues[idx]}
//         />
//       ))}
//     </>
//   );
// }