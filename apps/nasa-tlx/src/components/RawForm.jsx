import { useState } from "react";
import { saveAs } from "file-saver";
import SliderBlock from "./SliderBlock";
import { useToast, ToastContainer } from "./Toast";
import { downloadCSV, saveToGoogleSheets, makeCsv } from "../csvUtils";

export default function RawForm({
  participantId,
  condition,
  metaValid,
  saveMethod,
  sheetsUrl,
  sheetName
}) {
  /* slider state */
  const [effort,       setEffort]       = useState(10);
  const [frustration,  setFrustration]  = useState(10);
  const [mental,       setMental]       = useState(10);
  const [performance,  setPerformance]  = useState(10);
  const [physical,     setPhysical]     = useState(10);
  const [temporal,     setTemporal]     = useState(10);

  /* validation / messages */
  const [touched,     setTouched]     = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast system
  const { toasts, showError, showSuccess, removeToast } = useToast();

  // Progress calculation
  const sliders = [effort, frustration, mental, performance, physical, temporal];
  const defaultValues = [10, 10, 10, 10, 10, 10]; // All start at 10
  const movedSliders = sliders.filter((value, index) => value !== defaultValues[index]).length;
  const progress = (movedSliders / sliders.length) * 100;

  /* wrap each setter so we know at least one slider moved */
  const wrap = setter => v => {
    setter(v);
    setTouched(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitted || isSubmitting) {
      showError('Already submitted! Please wait...');
      return;
    }

    // Validation
    if (!participantId || !participantId.trim() || !condition || !condition.trim()) {
      showError("Please enter Participant ID and Condition.");
      return;
    }

    if (saveMethod === 'sheets' && !sheetsUrl.trim()) {
      showError('Please enter a Google Sheets URL');
      return;
    }

    if (!touched) {
      showError("Move at least one slider before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      /* scale 1–20 slider → NASA 5–100 */
      const scores = {
        Effort       : effort       * 5,
        Frustration  : frustration  * 5,
        Mental       : mental       * 5,
        Performance  : performance  * 5,
        Physical     : physical     * 5,
        Temporal     : temporal     * 5
      };

      const overall = Object.values(scores).reduce((a,b)=>a+b,0) / 6;

      let result;

      if (saveMethod === 'sheets') {
        // Prepare data for Google Sheets
        const sheetData = {
          participantID: participantId,
          condition: condition,
          mode: 'raw',
          scores: [
            ...Object.entries(scores).map(([dimension, score]) => ({ dimension, score })),
            { dimension: 'Overall', score: parseFloat(overall.toFixed(2)) }
          ]
        };

        showError('Saving to Google Sheets...', 'info');
        result = await saveToGoogleSheets(sheetData, sheetsUrl, sheetName);
      } else {
        // Original CSV download logic (maintain backward compatibility)
        const rows = Object.entries(scores).map(
          ([type,score]) => [participantId, condition, type, score]
        );
        rows.push([participantId, condition, "Overall", overall.toFixed(2)]);

        const csv  = makeCsv(rows);
        const blob = new Blob([csv], { type:"text/csv;charset=utf-8" });
        saveAs(blob, `${participantId}_${condition}_nasa_tlx.csv`);

        result = { success: true, message: "CSV downloaded successfully – thank you!" };
      }

      if (result.success) {
        setIsSubmitted(true);
        showSuccess(result.message);

        // Reset form after delay
        setTimeout(() => {
          setIsSubmitted(false);
          setIsSubmitting(false);
          setTouched(false);
          setEffort(10);
          setFrustration(10);
          setMental(10);
          setPerformance(10);
          setPhysical(10);
          setTemporal(10);
          showSuccess('Form reset - ready for next participant', 'info');
        }, 3000);
      } else {
        setIsSubmitting(false);
        showError(result.message);
      }

    } catch (error) {
      console.log("Error in handleSubmit:", error);
      setIsSubmitting(false);
      showError("Error submitting form. Please try again.");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Scrollable questionnaire wrapper */}
        <div className="questionnaire-wrapper">
          {/* Sticky progress bar */}
          <div className="progress-container-sticky">
            <div className="progress-label">
              Progress: {movedSliders} of {sliders.length} dimensions adjusted ({Math.round(progress)}%)
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="questionnaire-scroll">
            <p className="instruction-text">
              Please note that the following scale measures how well you think you did on the task.
            </p>

            <div className="sliders-container">
              <SliderBlock label="Effort"
                          description="How hard did you have to work to accomplish your level of performance?"
                          value={effort}        setValue={wrap(setEffort)} />
              <SliderBlock label="Frustration"
                          description="How insecure, discouraged, irritated, stressed, or annoyed were you?"
                          value={frustration}   setValue={wrap(setFrustration)} />
              <SliderBlock label="Mental Demand"
                          description="How mentally demanding was the task?"
                          value={mental}        setValue={wrap(setMental)} />
              <SliderBlock label="Performance"
                          description="How successful were you in accomplishing the task?"
                          value={performance}   setValue={wrap(setPerformance)} />
              <SliderBlock label="Physical Demand"
                          description="How physically demanding was the task?"
                          value={physical}      setValue={wrap(setPhysical)} />
              <SliderBlock label="Temporal Demand"
                          description="How hurried or rushed was the pace of the task?"
                          value={temporal}      setValue={wrap(setTemporal)} />
            </div>
          </div>
        </div>

        <div className="del">
          <button
            type="submit"
            disabled={isSubmitted || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : isSubmitted ? 'Submitted' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}