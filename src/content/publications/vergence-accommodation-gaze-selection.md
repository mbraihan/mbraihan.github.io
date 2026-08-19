---
title: "Evaluating the Vergence-Accommodation Conflict in Gaze-Based 3D Target Selection"
authors:
  - "Mohammad Raihanul Bashar"
  - "Mohammadreza Amini"
  - "Aunnoy K Mutasim"
  - "Mayra Donaji Barrera Machuca"
  - "Wolfgang Stuerzlinger"
  - "Anil Ufuk Batmaz"
venue: "IEEE Transactions on Visualization and Computer Graphics (IEEE ISMAR 2026)"
venueShort: "IEEE TVCG'26 (IEEE ISMAR)"
year: 2026
type: "Journal"
tags: ["HCI", "Extended Reality", "Eye Gaze", "3D Interaction", "Vergence-Accommodation Conflict", "Fitts' Law"]
selected: true
acceptanceNewsId: "ismar-2026-tvcg"
arxiv: "https://arxiv.org/abs/2607.27369"
bannerCaption: "Experimental task and depth configuration. (Left) Targets were placed at multiple depths spaced in diopters while maintaining constant perceived size. α (orange) denotes angular target distance and ω (blue) the angular target width. A dagger (†) marks the HMDs' focal plane. (Right) Participants selected targets using the controller or gaze (cursor highlighted)."
tldr: "Demonstrates that vergence-accommodation conflict degrades gaze-based 3D selection as targets move away from an HMD's focal region and that a diopter-aware Fitts' law model predicts this effect more accurately."
abstract: >-
  State-of-the-art head-mounted displays enable gaze-based selection in virtual environments, yet their vergence-accommodation conflict can affect interaction performance and eye-movement behavior. We investigated gaze-based 3D target selection across varying depth conditions. As visual depth increased, gaze-selection performance significantly decreased. A previously proposed Variation in Diopters Fitts' law model captured these performance changes better than a linear model. The findings show that gaze-based pointing is negatively affected by the vergence-accommodation conflict and that depth-dependent factors should be considered when designing gaze interaction for 3D environments.
methodologyText: "Twenty-four participants completed an ISO 9241-411 multidirectional target-selection task in a Meta Quest Pro. The within-subjects study compared gaze pointing with controller raycasting across six depth levels from 1.50 to 0.25 diopters, including targets in front of, at, and behind the headset's 0.75-diopter focal plane. The experiment recorded movement time, error rate, angular throughput, pointing variability, usability, workload, and qualitative feedback."
methodologyImages:
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785698557/Experimental_Procedure_ykujgg.jpg"
methodologyCaptions:
  - "Overview of the user study's experimental procedure, including consent, training, task execution, and post-study questionnaires."
resultsText: "As targets moved farther from the display's focal region, gaze movement time and error rates increased while angular throughput decreased. Gaze remained faster overall than controller raycasting, but its performance varied more strongly with depth. The Variation in Diopters model provided the strongest fit, reaching R-squared values of 0.93 for gaze and 0.84 for controller pointing."
resultsImages:
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785698818/THP_DC_rpj9ok.jpg"
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785698817/MT_DC_edhrot.jpg"
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785698816/THP_CD_khi4hk.jpg"
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785698815/MT_CD_b79hbr.jpg"
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785698814/ID_ALL_1_qwynvd.jpg"
resultsCaptions:
  - "Angular throughput across depth conditions (diopters) and interaction modalities."
  - "Movement time (MT) across depth conditions (diopters) and interaction modalities."
  - "Angular throughput comparison grouped by modality."
  - "Movement time comparison grouped by modality."
  - "Fitts' law regression of movement time (MT) as a function of index of difficulty (ID) for GAZE and CONTROLLER."
applicationText: "Depth-aware gaze interfaces can reduce the performance cost of the vergence-accommodation conflict by placing important targets near the focal region, stabilizing gaze input at challenging depths, and combining gaze with manual confirmation when precision is critical."
designGuidelines:
  - "Place frequently used gaze targets near the headset's focal region, preferably within approximately 0.5 diopters."
  - "Avoid small, dense, or precision-critical gaze targets at large depth offsets."
  - "Use depth-aware stabilization such as filtering, target expansion, or snap-to-target assistance."
  - "Combine gaze acquisition with hand or controller confirmation for precision-sensitive tasks."
  - "Model optical depth in diopters rather than relying only on geometric distance."
relatedPaperIds:
  - "visual-depth-vac-model"
  - "virtual-task-environments"
  - "effects-visual-depth-vac"
bibtex: |
  @article{bashar2026vergence,
    author = {Bashar, Mohammad Raihanul and Amini, Mohammadreza and Mutasim, Aunnoy K and Barrera Machuca, Mayra Donaji and Stuerzlinger, Wolfgang and Batmaz, Anil Ufuk},
    title = {Evaluating the Vergence-Accommodation Conflict in Gaze-Based 3D Target Selection},
    journal = {IEEE Transactions on Visualization and Computer Graphics},
    year = {2026},
    note = {To appear; presented at IEEE ISMAR 2026}
  }
order: 1
---
