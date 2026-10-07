// Generated from cv/cv.typ.njk by Eleventy; compiled to cv.pdf by the
// `eleventy.after` hook in .eleventy.js. Do not edit _site/ directly.

#let ink = rgb("#24231E")
#let muted = rgb("#625F55")
#let accent = rgb("#C25B34")

#set document(title: "Curriculum Vitae", author: "Tommy McMichen")
#set page(
  paper: "a4",
  margin: (x: 2.5cm, top: 2.2cm, bottom: 2.4cm),
  footer: context [
    #set text(size: 9pt, fill: muted)
    #h(1fr) Tommy McMichen — Page #counter(page).display() of #counter(page).final().first() #h(1fr)
  ],
)
#set text(font: "Libertinus Serif", size: 11pt, fill: ink, lang: "en")
#set par(leading: 0.8em, spacing: 1em, justify: false)
#show link: set text(fill: accent)

// Section headings: small caps over a thin rule, with room above.
#show heading.where(level: 1): it => block(above: 2.2em, below: 1em, sticky: true)[
  #text(size: 13pt, weight: "bold", tracking: 0.04em, smallcaps(it.body))
  #v(-0.5em)
  #line(length: 100%, stroke: 0.6pt + muted)
]

// "Left ........ right" row, e.g. a role and its dates.
#let row(lead, trail) = grid(
  columns: (1fr, auto),
  column-gutter: 1.5em,
  lead, align(right, trail),
)

// One entry in a list, kept together across page breaks.
#let entry(body) = block(breakable: false, above: 1em, below: 1em, body)

// =========================================================
// Header
#align(center)[
  #text(size: 26pt, weight: "bold", smallcaps[Tommy M#super[c]Michen])
  #v(0.2em)
  #text(size: 11pt)[
    University of Illinois Urbana-Champaign #h(0.6em)·#h(0.6em) Siebel School of Computing and Data Science
  ]
  #v(0.1em)
  #text(size: 10.5pt, fill: muted)[
    #link("mailto:johntm5@illinois.edu")[johntm5\@illinois.edu]
    #h(0.6em)·#h(0.6em)
    +1 (317) 519-2163
    #h(0.6em)·#h(0.6em)
    #link("http://mcmichen.cc")[www.mcmichen.cc]
  ]
]

// =========================================================
= Research Interests

My interests lie in _compilers_, specifically how we can leverage modern programming languages to design general-purpose _intermediate representations_ that (1) improve the precision of _static analysis_ by preserving high-level information, (2) enable novel _optimizations_ on the layout and organization of memory, and (3) open the door to _compiler-runtime codesigns_ that rethink existing hardware abstractions.

// =========================================================
= Professional Experience


#entry[
  #row[*University of Illinois Urbana-Champaign*, Urbana, Illinois, USA][2026 -- Present]
  #v(0.5em, weak: true)
  _Postdoctoral Research Associate_
  
  #v(0.6em, weak: true)
  #list(
    marker: [•],
    spacing: 0.7em,
    body-indent: 0.6em,
    [Automatic Compiler Construction],
    
  )
  
]

#entry[
  #row[*Meta*, Menlo Park, California, USA][Summer 2025]
  #v(0.5em, weak: true)
  _Software Engineering Intern, Programming Languages and Runtimes, Android Native Compiler Team_
  
  #v(0.6em, weak: true)
  #list(
    marker: [•],
    spacing: 0.7em,
    body-indent: 0.6em,
    [Improved the representation of ClangIR, an open-source C\/C++ MLIR compiler.],
    [Developed analyses and transformations for C++ move semantics in ClangIR.],
    [Lead ClangIR open-source development efforts through issue creation and code reviews.],
    
  )
  
]

#entry[
  #row[*Texas Instruments*, Dallas, Texas, USA][Summer 2019, Summer 2020]
  #v(0.5em, weak: true)
  _Digital Design Engineering Intern, Embedded Processors, Analytics Team_
  
  #v(0.6em, weak: true)
  #list(
    marker: [•],
    spacing: 0.7em,
    body-indent: 0.6em,
    [Performed integration testing for hardware implementation of cache coherence protocol.],
    [Developed coverage metrics for cache coherence testing.],
    [Implemented automatic generation of RTL and TLM from descriptor files.],
    
  )
  
]

#entry[
  #row[*National Instruments*, Austin, Texas, USA][Summer 2018]
  #v(0.5em, weak: true)
  _R&D Software Engineering Intern, Digitizers_
  
  #v(0.6em, weak: true)
  #list(
    marker: [•],
    spacing: 0.7em,
    body-indent: 0.6em,
    [Designed and implemented FPGA logic for new function generator feature with LabVIEW.],
    [Added kernel, driver and API support for new function generator feature.],
    [Implemented full driver stack support for highly-customisable oscilloscope triggers.],
    [Communicated with multiple teams to add new .NET API entry points.],
    
  )
  
]



// =========================================================
= Education


#entry[
  #row[*Northwestern University*, Evanston, Illinois][2020 -- 2026]
  
  #v(0.5em, weak: true)
  #row[
    Ph.D. in Computer Science, _Advised by Simone Campanoni_
  ][2026]
  
  #v(0.5em, weak: true)
  #row[
    M.Sc. in Computer Science, _Advised by Simone Campanoni_
  ][2023]
  
]

#entry[
  #row[*Rose-Hulman Institute of Technology*, Terre Haute, Indiana][2016 -- 2020]
  
  #v(0.5em, weak: true)
  #row[
    B.Sc. in Computer Engineering and Computer Science
  ][2020]
  
]


// =========================================================
= Publications


#entry[
  #row[
    *AI Coding Agents Need Better Compiler Remarks*, _CoDAIM 2026._
  ][]
  #v(0.4em, weak: true)
  #text(size: 10pt, fill: muted)[Akash Deo, Simone Campanoni, *Tommy McMichen*.]
]

#entry[
  #row[
    *Automatic Data Enumeration for Fast Data Collections*, _CGO 2026._
  ][#stack(dir: ltr, spacing: 0.35em,
      image("/assets/images/available.svg", height: 1.3em),
      image("/assets/images/reusable.svg", height: 1.3em),
      image("/assets/images/reproduced.svg", height: 1.3em),
    )]
  #v(0.4em, weak: true)
  #text(size: 10pt, fill: muted)[*Tommy McMichen*, Simone Campanoni.]
]

#entry[
  #row[
    *Saving Energy with Per-Variable Bitwidth Speculation*, _ASPLOS 2025._
  ][#stack(dir: ltr, spacing: 0.35em,
      image("/assets/images/available.svg", height: 1.3em),
    )]
  #v(0.4em, weak: true)
  #text(size: 10pt, fill: muted)[*Tommy McMichen*, David Dlott, Panitan Wongse-ammat, Nathan Greiner, Hussain Khajanchi, Russ Joseph, Simone Campanoni.]
]

#entry[
  #row[
    *Representing Data Collections in an SSA Form*, _CGO 2024._
  ][#stack(dir: ltr, spacing: 0.35em,
      image("/assets/images/available.svg", height: 1.3em),
      image("/assets/images/reusable.svg", height: 1.3em),
      image("/assets/images/reproduced.svg", height: 1.3em),
    )]
  #v(0.4em, weak: true)
  #text(size: 10pt, fill: muted)[*Tommy McMichen*, Nathan Greiner, Peter Zhong, Federico Sossai, Atmn Patel, Simone Campanoni.]
]

#entry[
  #row[
    *Getting a Handle on Unmanaged Memory*, _ASPLOS 2024._
  ][#stack(dir: ltr, spacing: 0.35em,
      image("/assets/images/available.svg", height: 1.3em),
      image("/assets/images/functional.svg", height: 1.3em),
      image("/assets/images/reproduced.svg", height: 1.3em),
    )]
  #v(0.4em, weak: true)
  #text(size: 10pt, fill: muted)[Nick Wanninger, *Tommy McMichen*, Simone Campanoni, Peter Dinda.]
]

#entry[
  #row[
    *Program State Element Characterization*, _CGO 2023._
  ][#stack(dir: ltr, spacing: 0.35em,
      image("/assets/images/available.svg", height: 1.3em),
      image("/assets/images/functional.svg", height: 1.3em),
      image("/assets/images/reproduced.svg", height: 1.3em),
    )]
  #v(0.4em, weak: true)
  #text(size: 10pt, fill: muted)[Enrico Armenio Deiana, Brian Suchy, Michael Wilkins, Brian Homerding, *Tommy McMichen*, Katarzyna Dunajewski, Peter Dinda, Nikos Hardavellas, Simone Campanoni.]
]

#entry[
  #row[
    *NOELLE Offers Empowering LLVM Extensions*, _CGO 2022._
  ][#stack(dir: ltr, spacing: 0.35em,
      image("/assets/images/available.svg", height: 1.3em),
      image("/assets/images/functional.svg", height: 1.3em),
      image("/assets/images/reproduced.svg", height: 1.3em),
    )]
  #v(0.4em, weak: true)
  #text(size: 10pt, fill: muted)[Angelo Matni, Enrico Armenio Deiana, Yian Su, Lukas Gross, Souradip Ghosh, Sotiris Apostolakis, Ziyang Xu, Zujun Tan, Ishita Chaturvedi, Brian Homerding, *Tommy McMichen*, David I. August, Simone Campanoni.]
]

#entry[
  #row[
    *Fine-Grained Acceleration using Runtime Integrated Custom Execution (RICE)*, _CASES 2019._
  ][]
  #v(0.4em, weak: true)
  #text(size: 10pt, fill: muted)[Leela Pakanati, *Tommy McMichen*, Zachary Estrada.]
]


// =========================================================
= Invited Talks


#entry[
  *"Representing Data Collections for Analysis and Transformation"*
  
  #v(0.5em, weak: true)
  #row[
    Languages, Systems, and Data Seminar, _University of California, Santa Cruz_.
  ][October 2025]
  
  #v(0.5em, weak: true)
  #row[
    Computer Architecture Group Meeting, _University of Cambridge_.
  ][March 2024]
  
  #v(0.5em, weak: true)
  #row[
    Tech Talk, _Rose-Hulman Institute of Technology_.
  ][October 2023]
  
  #v(0.5em, weak: true)
  #row[
    Student Seminar Series, _Northwestern University_.
  ][October 2023]
  
  #v(0.5em, weak: true)
  #row[
    Constellation Workshop, _Northwestern University_.
  ][July 2023]
  
]

#entry[
  *"Towards Collection-Oriented Compilation in LLVM"*
  
  #v(0.5em, weak: true)
  #row[
    LLVM Developers' Meeting.
  ][October  2025]
  
]



// =========================================================
= Teaching Experience


#entry[
  #row[
    *Teaching Assistant*, _COMP\_SCI 322 Compiler Construction_, Prof. Simone Campanoni.
  ][Winter 2022]
]

#entry[
  #row[
    *Resident Tutor*, _Computer Science and Computer Engineering Departments_.
  ][Aug. 2019 -- May 2020]
]


// =========================================================
= Service


#entry[
  #row[
    *Artifact Evaluation Committee*, International Symposium on Code Generation and Optimization (CGO).
  ][2027]
]

#entry[
  #row[
    *Student Volunteer*, Workshop on Advancing Theory, Research, and Practice for Generative AI in University-Level Computing Education.
  ][2026]
]

#entry[
  #row[
    *Artifact Evaluation Committee*, International Conference on Compiler Construction (CC).
  ][2026]
]

#entry[
  #row[
    *Board Member*, Computer Science PhD Advisory Council, Northwestern University.
  ][2025 -- 2026]
]

#entry[
  #row[
    *Board Member*, Computer Science Social Initiative, Northwestern University.
  ][2021 -- 2026]
]

#entry[
  #row[
    *Member*, CS Ph.D. Orientation Planning Committee, Northwestern University.
  ][2022 -- 2025]
]

#entry[
  #row[
    *Member*, CS Ph.D. Visit Day Planning Committee, Northwestern University.
  ][2022 -- 2026]
]

#entry[
  #row[
    *Student Volunteer*, International Symposium on Microarchitecture (MICRO).
  ][2022]
]

#entry[
  #row[
    *Chairperson*, IEEE, Rose-Hulman Institute of Technology student branch.
  ][2019 -- 2020]
]

#entry[
  #row[
    *Corresponding Secretary*, Eta Kappa Nu (HKN), Epsilon Eta Chapter.
  ][2019 -- 2020]
]

#entry[
  #row[
    *Member*, Eta Kappa Nu (HKN), Epsilon Eta Chapter.
  ][2018 -- 2020]
]


// =========================================================
= Awards and Funding


#entry[
  #row[
    PhD Student Leadership Award, _Northwestern University -- CS Department_.
  ][2026]
]

#entry[
  #row[
    PhD Student Research Award, _Northwestern University -- CS Department_.
  ][2026]
]

#entry[
  #row[
    LLVM Foundation Student Travel Grant, _LLVM Developers' Meeting_.
  ][2025]
]

#entry[
  #row[
    NSF Student Travel Grant, _ASPLOS_.
  ][2025]
]

#entry[
  #row[
    NSF Student Travel Grant, _HPCA\/PPoPP\/CGO_.
  ][2024]
]

#entry[
  #row[
    NSF Student Travel Grant, _HPCA\/PPoPP\/CGO_.
  ][2023]
]

#entry[
  #row[
    IP\/ROP Student Travel Award.
  ][2019]
]

#entry[
  #row[
    NSF Student Travel Grant, _ESweek_.
  ][2019]
]

#entry[
  #row[
    IP\/ROP Student Project Grant.
  ][2018]
]


// =========================================================
= Research Advising


#entry[
  #row[
    *Leyla Latifova*, B.Sc., _Fast Translation Validation for Transformation Pipelines_.
  ][2026 -- Present]
]

#entry[
  #row[
    *Akash Deo*, M.Sc., _Designing compiler tools for AI-assisted vectorization_.
  ][2025 -- 2026 (Apple)]
]

#entry[
  #row[
    *Benjamin Ye*, M.Sc., _Characterizing differences between LLVM front-ends_.
  ][2025 -- Present]
]

#entry[
  #row[
    *Benjamin Ye*, B.Sc., _Automatically generating #smallcaps[MemOIR] from Rust_.
  ][2024 -- 2025]
]

