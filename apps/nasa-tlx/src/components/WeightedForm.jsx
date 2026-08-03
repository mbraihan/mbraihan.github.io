import { useState } from "react";
import { saveAs } from "file-saver";
import SliderBlock from "./SliderBlock";
import { useToast, ToastContainer } from "./Toast";
import { downloadCSV, saveToGoogleSheets, makeCsv } from "../csvUtils";

/* canonical keys */
const KEYS = ["Mental","Physical","Temporal","Performance","Effort","Frustration"];

/* display labels (with "Demand" where NASA prints it) */
const LABEL = {
    Mental      : "Mental Demand",
    Physical    : "Physical Demand",
    Temporal    : "Temporal Demand",
    Performance : "Performance",
    Effort      : "Effort",
    Frustration : "Frustration"
};

const DESC = {
    Mental      : "How much mental and perceptual activity was required (e.g. thinking, deciding, calculating, remembering, looking, searching, etc)? Was the task easy or demanding, simple or complex, exacting or forgiving?",
    Physical    : "How much physical activity was required (e.g. pushing, pulling, turning, controlling, activating, etc)? Was the task easy or demanding, slow or brisk, slack or strenuous, restful or laborious?",
    Temporal    : "How much time pressure did you feel due to the rate of pace at which the tasks or task elements occurred? Was the pace slow and leisurely or rapid and frantic?",
    Performance : "How successful do you think you were in accomplishing the goals of the task set by the experimenter (or yourself)? How satisfied were you with your performance in accomplishing these goals?",
    Effort      : "How hard did you have to work (mentally and physically) to accomplish your level of performance?",
    Frustration : "How insecure, discouraged, irritated, stressed and annoyed versus secure, gratified, content, relaxed and complacent did you feel during the task?"
};

const SDESC = {
    Mental      : "How mentally demanding was the task?",
    Physical    : "How physically demanding was the task?",
    Temporal    : "How hurried or rushed was the pace of the task?",
    Performance : "How successful were you in accomplishing the task?",
    Effort      : "How hard did you have to work to accomplish your level of performance?",
    Frustration : "How insecure, discouraged, irritated, stressed, or annoyed were you?"
};

/* 15 pair combinations using canonical keys */
const PAIRS = [
    ["Mental","Physical"], ["Mental","Temporal"], ["Mental","Performance"],
    ["Mental","Effort"], ["Mental","Frustration"],
    ["Physical","Temporal"], ["Physical","Performance"], ["Physical","Effort"], ["Physical","Frustration"],
    ["Temporal","Performance"], ["Temporal","Effort"], ["Temporal","Frustration"],
    ["Performance","Effort"], ["Performance","Frustration"],
    ["Effort","Frustration"]
];

export default function WeightedForm({
  participantId,
  condition,
  metaValid,
  saveMethod,
  sheetsUrl,
  sheetName
}) {
    const [step, setStep]       = useState(1);
    const [pairIdx, setPairIdx] = useState(0);   // which pair we're on
    const [touched, setTouched] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [ratings, setR] = useState(KEYS.reduce((o,k)=>(o[k]=10,o),{}));
    const [weights, setW] = useState(KEYS.reduce((o,k)=>(o[k]=0 ,o),{}));

    // Toast system
    const { toasts, showError, showSuccess, removeToast } = useToast();

    // Progress calculation for step 1
    const defaultValues = KEYS.reduce((o,k)=>(o[k]=10,o),{});
    const movedSliders = KEYS.filter(key => ratings[key] !== defaultValues[key]).length;
    const ratingsProgress = (movedSliders / KEYS.length) * 100;

    // Progress calculation for step 2 (pair comparisons)
    const pairProgress = (pairIdx / PAIRS.length) * 100;

  /* ─── helpers ───────────────────────── */
    const wrap   = dim => v => { setR(p=>({...p,[dim]:v})); setTouched(true); };
    const choose = dim => { setW(p=>({...p,[dim]:p[dim]+1})); setPairIdx(i=>i+1); if(pairIdx+1===PAIRS.length) setStep(3); };

    const guard  = () => {
        if(!metaValid){
            showError("Please enter Participant ID and Condition.");
            return false;
        }
        if(!touched)  {
            showError("Move at least one slider before continuing.");
            return false;
        }
        return true;
    };

  /* ── transitions ─────────────────────────────── */
    function next(){
        if (guard()) {
            setStep(2);
            showSuccess("Step 1 completed! Now choose which factors contributed more to workload.");
        }
    }

    async function submit(){
        if (!guard()) return;

        if (saveMethod === 'sheets' && !sheetsUrl.trim()) {
            showError('Please enter a Google Sheets URL');
            return;
        }

        setIsSubmitting(true);

        try {
            const scaled = Object.fromEntries(KEYS.map(k=>[k, ratings[k]*5]));

            /* 2. weighted score per dimension */
            const sumW   = Object.values(weights).reduce((a,b)=>a+b,0) || 1;
            const wScore = Object.fromEntries(
                KEYS.map(k=>[k, +(scaled[k]*weights[k]/sumW).toFixed(2)])
            );

            const overall = +(Object.values(wScore).reduce((a,b)=>a+b,0)).toFixed(2);

            let result;

            if (saveMethod === 'sheets') {
                // Prepare data for Google Sheets
                const sheetData = {
                    participantID: participantId,
                    condition: condition,
                    mode: 'weighted',
                    scores: [
                        ...KEYS.map(k => ({ dimension: LABEL[k], score: wScore[k] })),
                        { dimension: 'Overall', score: overall }
                    ],
                    weights: Object.fromEntries(KEYS.map(k => [LABEL[k], weights[k]]))
                };

                showError('Saving to Google Sheets...', 'info');
                result = await saveToGoogleSheets(sheetData, sheetsUrl, sheetName);
            } else {
                // Original CSV download logic (maintain backward compatibility)
                const rows = KEYS.map(k=>[participantId,condition,LABEL[k],wScore[k]]);
                rows.push([participantId,condition,"Overall",overall]);

                const csv  = makeCsv(rows);
                const blob = new Blob([csv],{type:"text/csv;charset=utf-8"});
                saveAs(blob, `${participantId}_${condition}_nasa_tlx.csv`);

                result = { success: true, message: "CSV downloaded successfully – thank you!" };
            }

            if (result.success) {
                showSuccess(result.message);
                setStep(4);
            } else {
                showError(result.message);
            }

            setIsSubmitting(false);

        } catch (error) {
            console.error('Error in submit:', error);
            setIsSubmitting(false);
            showError("Error submitting form. Please try again.");
        }
    }

  /* STEP-1 ratings */
    if(step===1) return (
    <>
        <p>Step&nbsp;1&nbsp;/&nbsp;2 — Rate each workload dimension.</p>

        {/* Scrollable questionnaire wrapper */}
        <div className="questionnaire-wrapper">
          {/* Sticky progress bar */}
          <div className="progress-container-sticky">
            <div className="progress-label">
              Progress: {movedSliders} of {KEYS.length} dimensions adjusted ({Math.round(ratingsProgress)}%)
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${ratingsProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="questionnaire-scroll">
            <div className="sliders-container">
              {KEYS.map(dim=>(
                  <SliderBlock key={dim}
                      label={LABEL[dim]}
                      description={SDESC[dim]}
                      value={ratings[dim]}
                      setValue={wrap(dim)}
                  />
              ))}
            </div>
          </div>
        </div>

        <div className="next">
            <button onClick={next}>
                <span>Next</span>
                <svg viewBox="0 0 320 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
                </svg>
            </button>
        </div>

        {/* Toast notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
    );

  /* STEP-2 pair wizard */
    if(step===2){
        const [A,B]=PAIRS[pairIdx];
        return (
            <>
                {/* Progress for pair comparisons */}
                <div className="pair-progress-container">
                  <div className="progress-label">
                    Pair Comparisons: {pairIdx} of {PAIRS.length} completed ({Math.round(pairProgress)}%)
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${pairProgress}%` }}
                    ></div>
                  </div>
                </div>

                <p style={{textAlign:"center"}}>Pair {pairIdx+1} / 15</p>

                <div className="pair-card">
                    <p>Which dimension contributed <strong>more</strong> to your workload?</p>
                    <div className="pair-buttons">
                        <button onClick={()=>choose(A)}>{LABEL[A]}</button>
                        <span>vs</span>
                        <button onClick={()=>choose(B)}>{LABEL[B]}</button>
                    </div>
                </div>

                <div className="pair-info">
                    <div className="info-card"><h4>{LABEL[A]}</h4><p>{DESC[A]}</p></div>
                    <div className="info-card"><h4>{LABEL[B]}</h4><p>{DESC[B]}</p></div>
                </div>

                {/* Toast notifications */}
                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </>
        );
    }

  /* STEP-3 submit */
    if(step===3) return (
    <>
        <div className="del">
            <button
              onClick={submit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </div>

        {/* Toast notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
    );

  /* STEP-4 done */
    return (
        <>
            <p style={{textAlign: 'center', fontSize: '1.2rem', color: 'var(--accent)'}}>
                ✅ Data saved successfully — thank you!
            </p>
            {/* Toast notifications */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </>
    );
}