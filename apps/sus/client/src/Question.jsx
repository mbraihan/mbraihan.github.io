const SCALE = [
  { val: 1, label: 'Strongly\nDisagree' },
  { val: 2, label: 'Disagree' },
  { val: 3, label: 'Neutral' },
  { val: 4, label: 'Agree' },
  { val: 5, label: 'Strongly\nAgree' }
];

export default function Question({ index, text, onChange }) {
  return (
    <div className="question">
      <p><strong>{index + 1}.</strong> {text}</p>
      <div className="scale">
        {SCALE.map(opt => (
          <label key={opt.val} className="radio-label">
            <input type="radio" name={`q${index}`} value={opt.val} onChange={() => onChange(index, opt.val)} />
            {opt.label}
          </label>
        ))}
      </div>
    </div>

  );
}





// const SCALE = [
//   { val: 1, label: 'Strongly\nDisagree' },
//   { val: 2, label: 'Disagree' },
//   { val: 3, label: 'Neutral' },
//   { val: 4, label: 'Agree' },
//   { val: 5, label: 'Strongly\nAgree' }
// ];

// export default function Question({ index, text, onChange, selectedValue }) {
//   const handleCheckboxChange = (value) => {
//     if (selectedValue === value) {
//       onChange(index, null);
//     } else {
//       onChange(index, value);
//     }
//   };

//   const handleKeyDown = (e, value) => {
//     if (e.key === ' ' || e.key === 'Enter') {
//       e.preventDefault();
//       handleCheckboxChange(value);
//     } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
//       e.preventDefault();
//       const currentIndex = SCALE.findIndex(opt => opt.val === value);
//       const nextIndex = (currentIndex + 1) % SCALE.length;
//       const nextCheckbox = document.getElementById(`checkbox-${index}-${SCALE[nextIndex].val}`);
//       nextCheckbox?.focus();
//     } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
//       e.preventDefault();
//       const currentIndex = SCALE.findIndex(opt => opt.val === value);
//       const prevIndex = currentIndex === 0 ? SCALE.length - 1 : currentIndex - 1;
//       const prevCheckbox = document.getElementById(`checkbox-${index}-${SCALE[prevIndex].val}`);
//       prevCheckbox?.focus();
//     }
//   };

//   return (
//     <div className="question">
//       <p><strong>{index + 1}.</strong> {text}</p>
//       <div className="scale">
//         {SCALE.map((opt, optionIndex) => (
//           <div key={opt.val} className="scale-item">
//             <div className="checkbox-container">
//               <input
//                 className="checkbox-input"
//                 id={`checkbox-${index}-${opt.val}`}
//                 type="checkbox"
//                 name={`question-${index}`}
//                 value={opt.val}
//                 checked={selectedValue === opt.val}
//                 onChange={() => handleCheckboxChange(opt.val)}
//                 onKeyDown={(e) => handleKeyDown(e, opt.val)}
//                 tabIndex={optionIndex === 0 ? 0 : -1}
//               />
//               <label className="checkbox" htmlFor={`checkbox-${index}-${opt.val}`}>
//                 <span className="line line1"></span>
//                 <span className="line line2"></span>
//               </label>
//             </div>
//             <span className="scale-label">{opt.label}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }