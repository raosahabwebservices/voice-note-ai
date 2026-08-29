import { SmartNote } from '../types';

export const INITIAL_SAMPLE_NOTES: SmartNote[] = [
  {
    id: 'note-1',
    title: 'Data Structures & Algorithms: Graph Traversals (BFS & DFS)',
    category: 'Student',
    tags: ['Algorithms', 'ComputerScience', 'ExamPrep', 'Graphs'],
    summary: 'Lecture review covering graph representations (Adjacency List vs Matrix), Breadth-First Search (BFS), Depth-First Search (DFS), topological sorting, and shortest path algorithms for upcoming midterms.',
    transcript: "Today we covered graph theory fundamentals. Remember that BFS uses a Queue data structure and is optimal for shortest paths in unweighted graphs, while DFS uses a Stack (or recursion) and is great for detecting cycles and topological ordering. Make sure you know the time complexity O(V + E) for both algorithms. Midterm exam will test graph coloring and Dijkstra's algorithm as well.",
    keyPoints: [
      'BFS utilizes a Queue and finds shortest paths in unweighted graphs.',
      'DFS utilizes a Stack/Recursion for cycle detection and topological sorting.',
      'Time complexity for both BFS and DFS is O(V + E) using adjacency lists.',
      'Midterm covers Dijkstra and graph representations.'
    ],
    actionItems: [
      { task: 'Implement BFS and DFS in Python and C++', assignee: 'Self', completed: true, dueDate: '2026-08-05' },
      { task: 'Solve LeetCode 200: Number of Islands', assignee: 'Self', completed: false, dueDate: '2026-08-10' }
    ],
    deadlines: [
      { event: 'Algorithm Assignment 3 Due', date: 'August 12, 2026' },
      { event: 'Midterm Exam in Hall A', date: 'August 20, 2026' }
    ],
    questions: [
      'How does Dijkstra handle negative edge weights?',
      'What is the difference between strongly connected components in directed graphs?'
    ],
    audioDurationSeconds: 245,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    sourceType: 'sample'
  },
  {
    id: 'note-2',
    title: 'Organic Chemistry II: Reaction Mechanisms & Spectroscopy',
    category: 'Student',
    tags: ['Chemistry', 'ExamPrep', 'StudyNotes', 'NMR'],
    summary: 'Comprehensive lecture review covering carbonyl condensation reactions, Aldol additions, Claisen condensations, and Interpretation of H-NMR and C-NMR spectroscopy for midterms.',
    transcript: "Today's lecture focused heavily on enolates, Aldol reactions, and spectroscopic analysis. Remember that thermodynamic enolates are formed under high temperature with a weaker, more substituted base like LDA at low temp gives kinetic enolates. When analyzing NMR spectra, always check the chemical shift, integration, splitting pattern (n+1 rule), and number of unique carbon environments. Professor Higgins announced that midterm exam 2 is scheduled for next Wednesday in Hall B.",
    keyPoints: [
      'Kinetic vs Thermodynamic enolates: LDA at -78°C gives kinetic enolate; warmer temps favor thermodynamic.',
      'NMR Spectroscopy: Use n+1 rule for splitting patterns; chemical shifts indicate electronegative shielding.',
      'Midterm exam covers chapters 16 through 21.'
    ],
    actionItems: [
      { task: 'Complete practice problem set 4 on enolate synthesis', assignee: 'Self', completed: true, dueDate: '2026-08-03' },
      { task: 'Review NMR chemical shift reference table', assignee: 'Self', completed: false, dueDate: '2026-08-06' }
    ],
    deadlines: [
      { event: 'Midterm Exam 2 (Hall B)', date: 'August 12, 2026' },
      { event: 'Problem Set 4 Submission', date: 'August 4, 2026' }
    ],
    questions: [
      'How do cross-aldol reactions prevent self-condensation products?',
      'What distinguishes splitting in complex aromatic systems?'
    ],
    audioDurationSeconds: 412,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    sourceType: 'sample'
  },
  {
    id: 'note-3',
    title: 'Microeconomics: Market Equilibrium & Elasticity',
    category: 'Study',
    tags: ['Economics', 'Micro', 'SupplyAndDemand', 'StudyNotes'],
    summary: 'Review session on price elasticity of demand, consumer surplus, deadweight loss from taxation, and market equilibrium shifts under government price ceilings and floors.',
    transcript: "Today we analyzed supply and demand elasticity. When demand is inelastic (like gasoline or medicine), a price increase leads to a disproportionately small drop in quantity demanded, maximizing total revenue for suppliers. We also reviewed tax incidence and how deadweight loss increases exponentially with the size of a deadweight tax. Midterm review session is this Friday.",
    keyPoints: [
      'Price elasticity of demand measures responsiveness of quantity to price changes.',
      'Inelastic demand generates higher revenue on price hikes.',
      'Deadweight loss represents economic inefficiency caused by market distortion.'
    ],
    actionItems: [
      { task: 'Solve chapter 7 elasticity problem worksheet', assignee: 'Self', completed: true, dueDate: '2026-08-02' },
      { task: 'Read case study on rent control price ceilings', assignee: 'Self', completed: false, dueDate: '2026-08-08' }
    ],
    deadlines: [
      { event: 'Economics Quiz 2', date: 'August 15, 2026' }
    ],
    questions: [
      'How does cross-price elasticity determine substitute vs complementary goods?',
      'What is the formula for calculating midpoint elasticity?'
    ],
    audioDurationSeconds: 320,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    sourceType: 'sample'
  },
  {
    id: 'note-4',
    title: 'World History: Industrial Revolution & Social Impact',
    category: 'Student',
    tags: ['History', 'IndustrialRev', 'LectureNotes'],
    summary: 'Lecture notes covering the transition from agrarian economies to mechanized industrial production in 18th-century Britain, urbanization, labor unions, and factory acts.',
    transcript: "The Industrial Revolution began in Britain due to abundant coal reserves, iron ore, stable banking systems, and colonial markets. We discussed the devastating impact on urban working conditions, child labor, and the eventual rise of trade unionism and the Factory Acts of 1833 which limited working hours for juveniles.",
    keyPoints: [
      'Britain was the birthplace of industrialization due to coal, capital, and colonies.',
      'Urbanization created severe sanitation challenges and tenement overcrowding.',
      'Factory Acts of 1833 established early labor protections and inspection standards.'
    ],
    actionItems: [
      { task: 'Write essay draft on primary sources of child labor', assignee: 'Self', completed: true, dueDate: '2026-08-01' },
      { task: 'Review lecture slides on steam engine innovations', assignee: 'Self', completed: false, dueDate: '2026-08-06' }
    ],
    deadlines: [
      { event: 'History Research Essay Due', date: 'August 18, 2026' }
    ],
    questions: [
      'How did the steam engine transform textile manufacturing locations?',
      'What role did railways play in unifying national markets?'
    ],
    audioDurationSeconds: 180,
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    sourceType: 'sample'
  }
];
