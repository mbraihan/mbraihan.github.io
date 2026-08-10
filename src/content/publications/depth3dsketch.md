---
title: "Depth3DSketch: Freehand Sketching Out of Arm's Reach in Virtual Reality"
authors:
  - "Mohammad Raihanul Bashar"
  - "Mohammadreza Amini"
  - "Wolfgang Stuerzlinger"
  - "Mine Sarac"
  - "Ken Pfeuffer"
  - "Mayra Donaji Barrera Machuca"
  - "Anil Ufuk Batmaz"
venue: "CHI 2025 Late-Breaking Work"
venueShort: "CHI LBW 25"
year: 2025
type: "Poster"
tags: ["HCI", "Virtual Reality", "Eye Gaze", "3D Interaction", "3D Sketching", "Multimodal Interaction"]
selected: false
acceptanceNewsId: "depth3dsketch-chi-2025"
image: "https://res.cloudinary.com/dqkxtivbq/image/upload/v1751598099/CHI_depth3DSketch_f1hs5y.gif"
bannerCaption: "(a) Depth selection interaction methods used in the study: RayCursor, Conductor, and Gaze+Controller. (b) Example sketching results showing shape quality across interaction methods."
pdf: "https://dl.acm.org/doi/pdf/10.1145/3706599.3719717"
doi: "https://doi.org/10.1145/3706599.3719717"
poster: "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785703054/pos_25_hcxqwv.jpg"
website: "https://dl.acm.org/doi/full/10.1145/3706599.3719717"
tldr: "Presents a freehand VR sketching technique for drawing up to 2.5 meters away and compares joystick, bimanual, and gaze-assisted depth control."
abstract: >-
  Due to the increasing availability and popularity of virtual reality (VR) systems, 3D sketching applications have also boomed. Most of these applications focus on peripersonal sketching, e.g., within arm's reach. Yet, sketching in larger scenes requires users to walk around the virtual environment while sketching or to change the sketch scale repeatedly. This paper presents Depth3DSketch, a 3D sketching technique that allows users to sketch objects up to 2.5 m away with a freehand sketching technique. Users can select the sketching depth with three interaction methods: using the joystick on a single controller, the intersection from two controllers, or the intersection from the controller ray and the user's gaze. We compared these interaction methods in a user study. Results show that users preferred the joystick to select visual depth, but there was no difference in user accuracy or sketching time between the three methods.
methodologyText: "We evaluated three depth-selection interaction methods for Depth3DSketch—RayCursor (joystick distance control), Conductor (intersection of two controller rays), and Gaze+Controller (eye gaze aligned with a controller plane)—across 1-1.5 m and 2-2.5 m sketching distances in a Meta Quest Pro."
methodologyImages:
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785703730/flow_vi6bsh.jpg"
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785703728/Selection_Sketch_xnxis6.jpg"
methodologyCaptions:
  - "Depth3DSketch technique flow diagram illustrating depth selection and sketching state transitions."
  - "Illustrations of the three depth selection methods (RayCursor, Conductor, Gaze+Controller) during depth selection and 3D sketching phases."
resultsText: "Participants successfully sketched 3D shapes across all conditions without significant accuracy or time trade-offs. The uni-modal RayCursor method emerged as the most preferred technique with the lowest cognitive workload."
resultsImages:
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785703754/NASA_depth_ig61t0.png"
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785703756/Overall_Line_depth_cbnwvq.png"
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785703758/Straightness_Line_depth_jtnfhx.png"
  - "https://res.cloudinary.com/dqkxtivbq/image/upload/v1785703760/time_depth_gnjloe.png"
resultsCaptions:
  - "NASA-TLX subjective workload subscales across the three depth selection interaction techniques."
  - "Overall stroke straightness scores comparing sketching performance across depth distances."
  - "Line straightness score comparison across target depth distances (1-1.5 m vs. 2-2.5 m)."
  - "Task completion time comparison between Cube and Pyramid 3D sketching tasks."
applicationText: "Distant 3D sketching techniques enable artists and designers to populate large virtual environments without constant scene rescaling, reducing physical fatigue and maintaining spatial context."
designGuidelines:
  - "Leverage simple, uni-modal controls (such as joystick distance adjustment) for depth selection to minimize cognitive load."
  - "Provide clear visual depth references when sketching outside peripersonal space."
  - "Account for reduced line straightness at larger interaction distances during freehand stroke rendering."
bibtex: |
  @inproceedings{bashar2025depth3dsketch,
    author = {Bashar, Mohammad Raihanul and Amini, Mohammadreza and Stuerzlinger, Wolfgang and Sarac, Mine and Pfeuffer, Ken and Barrera Machuca, Mayra Donaji and Batmaz, Anil Ufuk},
    title = {Depth3DSketch: Freehand Sketching Out of Arm's Reach in Virtual Reality},
    booktitle = {Extended Abstracts of the 2025 CHI Conference on Human Factors in Computing Systems},
    series = {CHI EA '25},
    address = {Yokohama, Japan},
    articleno = {312},
    numpages = {8},
    year = {2025},
    doi = {10.1145/3706599.3719717}
  }
order: 7
---
