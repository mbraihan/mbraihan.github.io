---
title: "Eyes on Many: Evaluating Gaze, Hand, and Voice for Multi-Object Selection in Extended Reality"
authors:
  - "Mohammad Raihanul Bashar"
  - "Aunnoy K. Mutasim"
  - "Ken Pfeuffer"
  - "Anil Ufuk Batmaz"
venue: "CHI 2026"
venueShort: "CHI 26"
year: 2026
type: "Conference"
tags: ["HCI", "Extended Reality", "Eye Gaze", "Multimodal Interaction", "3D Interaction"]
selected: true
acceptanceNewsId: "chi-2026-paper"
pdf: "https://dl.acm.org/doi/pdf/10.1145/3772318.3790513"
arxiv: "https://arxiv.org/abs/2602.12406"
doi: "https://doi.org/10.1145/3772318.3790513"
website: "https://dl.acm.org/doi/10.1145/3772318.3790513"
video: "https://youtu.be/cdVTi9oRtCo"
bannerCaption: "Overview of four mode-switching and three subselection techniques for gaze-based multi-object selection in XR."
tldr: "Compares gaze, hand, and voice combinations for selecting multiple XR objects, finding that DoublePinch with Gaze+Pinch offers the strongest overall performance."
abstract: >-
  Interacting with multiple objects simultaneously makes us fast. A pre-step to this interaction is to select the objects, i.e., multi-object selection, which is enabled through two steps: (1) toggling multi-selection mode - mode-switching - and then (2) selecting all the intended objects - subselection. In extended reality (XR), each step can be performed with the eyes, hands, and voice. To examine how design choices affect user performance, we evaluated four mode-switching (SemiPinch, FullPinch, DoublePinch, and Voice) and three subselection techniques (Gaze+Dwell, Gaze+Pinch, and Gaze+Voice) in a user study. Results revealed that while DoublePinch paired with Gaze+Pinch yielded the highest overall performance, SemiPinch achieved the lowest performance. Although Voice-based mode-switching showed benefits, Gaze+Voice subselection was less favored, as the required repetitive vocal commands were perceived as tedious. Overall, these findings provide empirical insights and inform design recommendations for multi-selection techniques in XR.
methodologyVideos:
  - title: "SemiPinch"
    embedSrc: "https://player.cloudinary.com/embed/?cloud_name=dqkxtivbq&public_id=Semi_rvhb3d"
    description: "Multi-selection is activated when the distance between thumb and index fingertips is within 2–7 cm (a partial pinch pose). Users maintain this grip to stay in multi-selection mode while subselecting targets. The grouping is finalized with a full-pinch. Releasing the semi-pinch reverts to single-selection mode."
  - title: "FullPinch"
    embedSrc: "https://player.cloudinary.com/embed/?cloud_name=dqkxtivbq&public_id=FP_V_wj7foq"
    description: "The user maintains a full-pinch (thumb and index fingertips < 2 cm apart) to activate and sustain multi-selection mode. When the pinch is released (> 7 cm apart), the system waits 250 ms before deactivating the mode and finalizing the group."
  - title: "DoublePinch"
    embedSrc: "https://player.cloudinary.com/embed/?cloud_name=dqkxtivbq&public_id=DP_Pinch_1_qlwu9r"
    description: "A double-pinch is recognized when a full-pinch is released and performed again within 350 ms. This persistently toggles multi-selection mode on. Another double-pinch deactivates the mode and finalizes the selected group."
  - title: "Voice"
    embedSrc: "https://player.cloudinary.com/embed/?cloud_name=dqkxtivbq&public_id=Voice_S_tbgkfb"
    description: "Participants use a spoken command (e.g., \"group\", \"multi\") to activate multi-selection, and a distinct term (e.g., \"done\", \"finish\") to deactivate and finalize. This provides a hands-free persistent mode-switching option."
resultsImages:
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1786300708/IE_RR_N_d9hcj6.png"
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785692020/Subjective_RR_N_krtytq.png"
resultsCaptions:
  - "Inverse Efficiency (IE) across subselection techniques, mode-switching methods, and target counts."
  - "Subjective evaluation ratings for usability, fatigue, and user preference."
resultsText: >-
  DoublePinch paired with Gaze+Pinch yielded the highest overall performance in terms of task completion time, error rate, and inverse efficiency. SemiPinch produced the highest mode and selection error rate, lowest efficiency, and was rated as the most fatiguing. Voice-based mode-switching showed benefits for hands-free interaction, but Gaze+Voice subselection was less favored due to the tedium of repetitive vocal commands. 17 out of 30 participants preferred DoublePinch for mode-switching, and 15 preferred Gaze+Dwell for subselection.
relatedPaperIds:
  - "virtual-task-environments"
bibtex: |
  @inproceedings{bashar2026eyes,
    author = {Bashar, Mohammad Raihanul and Mutasim, Aunnoy K. and Pfeuffer, Ken and Batmaz, Anil Ufuk},
    title = {Eyes on Many: Evaluating Gaze, Hand, and Voice for Multi-Object Selection in Extended Reality},
    booktitle = {Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems},
    series = {CHI '26},
    articleno = {671},
    numpages = {14},
    year = {2026},
    doi = {10.1145/3772318.3790513}
  }
order: 3
---
